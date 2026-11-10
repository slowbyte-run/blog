/**
 * 把 source/posts 下的文章同步到博客园（https://www.cnblogs.com/slowbyte）。
 *
 * 用法：
 *   pnpm run sync:cnblogs              # 只打印计划，不写远端
 *   pnpm run sync:cnblogs -- --apply   # 真正执行
 *   pnpm run sync:cnblogs -- --only LCA --apply
 *   pnpm run sync:cnblogs -- --limit 1 --apply
 *
 * 行为：
 *   - 已在 cnblogs-map.json 或 frontmatter `link: cnblogs-<id>` 里登记过的文章 -> 覆盖正文；
 *   - 其余 -> 新建随笔，并把返回的 postid 写回 cnblogs-map.json（重复执行不会重发）；
 *   - 覆盖前把远端原文备份到 .cache/cnblogs-backup/；
 *   - 远端内容与本地一致时跳过，保证幂等；
 *   - 默认跳过 draft: true 与模板文件。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import {
  BACKUP_DIR,
  BLOG_APP,
  MAP_FILE,
  RPC_ENDPOINT,
} from './lib/cnblogs/config';
import { loadLocalPosts, buildCreateCategories } from './lib/cnblogs/posts';
import { buildPayload, isPayloadApplied } from './lib/cnblogs/transform';
import { createCnblogsClient, DailyQuotaError } from './lib/cnblogs/remote';
import {
  classifyVisibility,
  type Visibility,
  type VisibilityResult,
} from './lib/cnblogs/status';
import {
  adoptByTitle,
  assertNoCollisions,
  resolveTarget,
  type PlanItem,
} from './lib/cnblogs/plan';
import type { RemotePost } from './lib/cnblogs/remote';

interface CliOptions {
  apply: boolean;
  only?: string;
  limit?: number;
  withTags: boolean;
  withCategories: boolean;
  includeDrafts: boolean;
  /** 新建时是否直接发布；false 表示先存草稿。 */
  publish: boolean;
  /** 内容一致也强制写一次，用于把草稿转成已发布。 */
  force: boolean;
  /** 删除指定 postid，并从映射表里摘掉。 */
  deleteId?: string;
  /** 只检查线上可达性，不写远端。 */
  status: boolean;
  intervalMs: number;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    apply: false,
    withTags: false,
    withCategories: false,
    includeDrafts: false,
    publish: true,
    force: false,
    status: false,
    intervalMs: 3200,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--apply':
        options.apply = true;
        break;
      case '--only':
        options.only = argv[++i];
        break;
      case '--limit': {
        const value = Number(argv[++i]);
        if (!Number.isFinite(value) || value <= 0) {
          throw new Error('--limit expects a positive number');
        }
        options.limit = value;
        break;
      }
      case '--interval': {
        const value = Number(argv[++i]);
        if (!Number.isFinite(value) || value < 0) {
          throw new Error('--interval expects a non-negative number');
        }
        options.intervalMs = value;
        break;
      }
      case '--with-tags':
        options.withTags = true;
        break;
      case '--with-categories':
        options.withCategories = true;
        break;
      case '--include-drafts':
        options.includeDrafts = true;
        break;
      case '--draft':
        options.publish = false;
        break;
      case '--force':
        options.force = true;
        break;
      case '--delete':
        options.deleteId = argv[++i];
        break;
      case '--status':
        options.status = true;
        break;
      case '--help':
      case '-h':
        console.log(
          [
            'Usage: tsx scripts/syncCnblogs.ts [options]',
            '',
            '  --apply              write to cnblogs (default: dry-run)',
            '  --only <substring>   only sync posts whose path contains it',
            '  --limit <n>          sync at most n posts',
            '  --interval <ms>      delay between writes (default 3200)',
            '  --with-tags          also push frontmatter tags as keywords',
            '  --with-categories    also push frontmatter categories',
            '  --include-drafts     include posts marked draft: true',
            '  --draft              create new posts as drafts (publish later)',
            '  --force              write even when content is unchanged',
            '  --delete <postid>    delete one post (requires --apply)',
            '  --status             probe public visibility of every post',
          ].join('\n'),
        );
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function loadEnv(cwd: string): Promise<Record<string, string>> {
  const env: Record<string, string> = {};
  try {
    const raw = await fs.readFile(path.join(cwd, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '');
      env[key] = value;
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') throw error;
  }
  return { ...env, ...process.env } as Record<string, string>;
}

async function loadMap(cwd: string): Promise<Record<string, string>> {
  const file = path.join(cwd, MAP_FILE);
  let raw: string;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw error;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('expected a JSON object');
    }
    const map: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.trim()) map[key] = value.trim();
    }
    return map;
  } catch (error) {
    // 映射表损坏时直接中止：继续跑会重复创建随笔。
    throw new Error(
      `Cannot parse ${MAP_FILE}: ${String(error)}. Fix it before syncing.`,
    );
  }
}

async function saveMap(cwd: string, map: Record<string, string>) {
  const file = path.join(cwd, MAP_FILE);
  const sorted = Object.fromEntries(
    Object.entries(map).sort(([a], [b]) => a.localeCompare(b)),
  );
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  await fs.rename(tmp, file);
}

async function backupRemote(cwd: string, post: RemotePost) {
  const dir = path.join(cwd, BACKUP_DIR);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, `${post.postid}.json`),
    `${JSON.stringify(post, null, 2)}\n`,
    'utf8',
  );
}

async function probeVisibility(
  postid: string,
): Promise<VisibilityResult | { visibility: 'error'; detail: string }> {
  const url = `https://www.cnblogs.com/${BLOG_APP}/p/${postid}`;
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { 'user-agent': 'astro-snow-cnblogs-sync/1.0' },
    });
    return classifyVisibility(res.status, res.headers.get('location'));
  } catch (error) {
    return { visibility: 'error', detail: String(error) };
  }
}

/** 逐篇探测线上可见性：公开 / 需登录（审核或私有）/ 404 / 未创建。 */

/** 新建后确认真的公开了：博客园可能把某些随笔放进审核队列。 */
async function confirmPublished(postid: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { visibility } = await probeVisibility(postid);
    if (visibility === 'public') return true;
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  return false;
}

async function reportStatus(items: PlanItem[]): Promise<void> {
  const counts: Record<Visibility | 'error', number> = {
    public: 0,
    restricted: 0,
    missing: 0,
    pending: 0,
    error: 0,
  };
  const issues: string[] = [];

  for (const item of items) {
    const { post } = item;
    if (!item.targetId) {
      counts.pending += 1;
      issues.push(`PENDING    ${post.key}`);
      continue;
    }
    const { visibility, detail } = await probeVisibility(item.targetId);
    counts[visibility] += 1;
    if (visibility !== 'public') {
      issues.push(
        `${visibility.toUpperCase().padEnd(10)} ${item.targetId} (${detail}) ${post.title}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(
    `public=${counts.public} restricted=${counts.restricted} missing=${counts.missing} pending=${counts.pending} error=${counts.error}`,
  );
  for (const line of issues) console.log(`  ${line}`);
}

async function main() {
  const cwd = process.cwd();
  const options = parseArgs(process.argv.slice(2));

  const env = await loadEnv(cwd);
  const username = env.CNBLOGS_USERNAME?.trim();
  const token = env.CNBLOGS_TOKEN?.trim();
  if (!username || !token) {
    console.error(
      chalk.red(
        'Missing CNBLOGS_USERNAME / CNBLOGS_TOKEN. Put them in .env (gitignored).',
      ),
    );
    process.exitCode = 1;
    return;
  }

  const map = await loadMap(cwd);
  const client = createCnblogsClient({
    username,
    token,
    endpoint: env.CNBLOGS_ENDPOINT?.trim() || RPC_ENDPOINT,
    minIntervalMs: options.intervalMs,
  });

  if (options.deleteId) {
    if (!options.apply) {
      console.error(chalk.red('--delete requires --apply.'));
      process.exitCode = 1;
      return;
    }
    const target = await client.get(options.deleteId);
    console.log(chalk.red(`Deleting ${target.postid}: ${target.title}`));
    await client.remove(target.postid);
    const pruned = Object.entries(map).filter(([, id]) => id !== target.postid);
    if (pruned.length !== Object.keys(map).length) {
      await saveMap(cwd, Object.fromEntries(pruned));
      console.log(chalk.gray('Removed the mapping entry as well.'));
    }
    console.log(chalk.green('Deleted.'));
    return;
  }

  const { posts, skipped } = await loadLocalPosts({
    cwd,
    only: options.only,
    limit: options.limit,
    includeDrafts: options.includeDrafts,
  });

  if (!posts.length) {
    console.log(chalk.yellow('No post matched. Nothing to do.'));
    return;
  }

  if (options.status) {
    // 先认领同名随笔，避免中断后重跑时把已存在的文章报成 PENDING。
    const remoteForStatus = await client.list(500);
    const statusItems = posts.map((post) => resolveTarget(post, map));
    adoptByTitle(statusItems, remoteForStatus);
    await reportStatus(statusItems);
    return;
  }

  const remote = await client.list(500);
  const remoteById = new Map(remote.map((post) => [post.postid, post]));

  const items = posts.map((post) => resolveTarget(post, map));
  adoptByTitle(items, remote);
  assertNoCollisions(items);

  console.log(
    chalk.cyan(
      `\nBlog: https://www.cnblogs.com/${username}  (dry-run=${!options.apply})`,
    ),
  );
  console.log(
    `Posts: ${posts.length}  |  update: ${items.filter((i) => i.targetId).length}  |  new: ${items.filter((i) => !i.targetId).length}`,
  );
  if (skipped.length) {
    const drafts = skipped.filter((s) => s.reason === 'draft').length;
    console.log(
      chalk.gray(
        `Skipped: ${skipped.length} (draft: ${drafts}, other: ${skipped.length - drafts})`,
      ),
    );
    for (const item of skipped.filter((s) => s.reason !== 'draft')) {
      console.log(chalk.yellow(`  ! ${item.key}: ${item.reason}`));
    }
  }

  console.log(chalk.gray(`Remote posts visible: ${remote.length}\n`));

  const covered = new Set(items.map((item) => item.targetId ?? ''));
  const untouched = remote.filter((post) => !covered.has(post.postid));

  let updated = 0;
  let created = 0;
  let unchanged = 0;
  let failed = 0;
  let quotaHit = false;

  for (const [index, item] of items.entries()) {
    const label = `${String(index + 1).padStart(3, ' ')}/${items.length}`;
    const { post } = item;

    if (!item.targetId) {
      console.log(
        `${label} ${chalk.green('NEW   ')} ${post.title}  ${chalk.gray(`(${post.key})`)}`,
      );
      if (!options.apply) continue;
      try {
        const payload = buildPayload(post, {
          withTags: options.withTags,
          categories: buildCreateCategories(
            post.categoryPaths,
            options.withCategories,
          ),
        });
        const id = await client.create(payload, options.publish);
        map[post.key] = id;
        await saveMap(cwd, map);
        created += 1;
        console.log(`        ${chalk.green('+')} created as ${id}`);
        if (!(await confirmPublished(id))) {
          console.log(
            chalk.yellow(
              `        ? ${id} 暂不可公开访问，可能进了博客园审核队列`,
            ),
          );
        }
      } catch (error) {
        if (error instanceof DailyQuotaError) {
          quotaHit = true;
          console.log(
            chalk.yellow(`        ! ${error.message} —— 停止本轮，等额度恢复`),
          );
          break;
        }
        failed += 1;
        console.error(`        ${chalk.red('x')} ${String(error)}`);
      }
      continue;
    }

    const remotePost = remoteById.get(item.targetId);
    if (!remotePost) {
      console.log(
        `${label} ${chalk.yellow('MISS  ')} ${post.title} -> ${item.targetId} not found remotely`,
      );
      failed += 1;
      continue;
    }

    if (options.apply && item.source === 'title') {
      map[post.key] = item.targetId;
      await saveMap(cwd, map);
      item.source = 'map';
    }

    const payload = buildPayload(post, {
      keepCategories: remotePost.categories,
      keepKeywords: remotePost.keywords,
      dateCreated: remotePost.dateCreated || undefined,
      withTags: options.withTags,
    });

    if (!options.force && isPayloadApplied(payload, remotePost)) {
      unchanged += 1;
      console.log(
        `${label} ${chalk.gray('SAME  ')} ${post.title}  ${chalk.gray(`(${item.targetId})`)}`,
      );
      continue;
    }

    const action =
      item.source === 'title' ? chalk.magenta('ADOPT ') : chalk.blue('UPDATE');
    console.log(
      `${label} ${action} ${post.title} -> ${item.targetId}  ${chalk.gray(`(${remotePost.title})`)}`,
    );
    if (!options.apply) continue;

    try {
      await backupRemote(cwd, remotePost);
      await client.update(item.targetId, payload);
      updated += 1;
    } catch (error) {
      if (error instanceof DailyQuotaError) {
        quotaHit = true;
        console.log(
          chalk.yellow(`        ! ${error.message} —— 停止本轮，等额度恢复`),
        );
        break;
      }
      failed += 1;
      console.error(`        ${chalk.red('x')} ${String(error)}`);
    }
  }

  if (untouched.length) {
    console.log(chalk.gray(`\nUntouched remote posts: ${untouched.length}`));
    for (const post of untouched.slice(0, 20)) {
      console.log(chalk.gray(`  - ${post.postid}  ${post.title}`));
    }
    if (untouched.length > 20) {
      console.log(chalk.gray(`  ... and ${untouched.length - 20} more`));
    }
  }

  if (options.apply) {
    console.log(
      `\nDone. updated=${updated} created=${created} unchanged=${unchanged} failed=${failed}`,
    );
    if (quotaHit) {
      console.log(
        chalk.yellow(
          'Daily quota exhausted. Re-run the same command after it resets.',
        ),
      );
      // 退出码 2 区分「额度用尽」和其它失败，方便定时任务判断。
      process.exitCode = 2;
    } else if (failed > 0) {
      process.exitCode = 1;
    }
  } else {
    console.log(
      chalk.yellow('\nDry run only. Re-run with --apply to write to cnblogs.'),
    );
  }
}

main().catch((error) => {
  console.error(chalk.red(String(error)));
  process.exitCode = 1;
});
