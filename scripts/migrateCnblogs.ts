/**
 * Migrate / sync posts from cnblogs (博客园) into source/posts/.
 *
 * Usage:
 *   npx tsx scripts/migrateCnblogs.ts            # migrate all whitelisted posts
 *   npx tsx scripts/migrateCnblogs.ts --limit 3  # only first 3 (dry-run for testing)
 *
 * Behaviour:
 *   - Crawls the cnblogs blog list pages, collects post metadata.
 *   - Keeps only posts whose id is in scripts/cnblogs-whitelist.json.
 *   - Skips posts whose target file already exists (idempotent, safe to re-run).
 *   - Downloads images into source/img/posts/cnblogs-<id>/ and rewrites links.
 *   - Emits source/posts/cnblogs-<id>.md with the blog's frontmatter schema.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const BLOG_URL = 'https://www.cnblogs.com/slowbyte';
const WHITELIST_FILE = new URL('./cnblogs-whitelist.json', import.meta.url);
const POSTS_DIR = new URL('../source/posts/', import.meta.url);
const IMG_ROOT = new URL('../source/img/posts/', import.meta.url);

const args = process.argv.slice(2);
const limit = Number(args[args.indexOf('--limit') + 1]) || Infinity;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; cnblogs-migrate/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Crawl all list pages and collect post metadata. */
async function crawlList(): Promise<
  Array<{ id: string; title: string; date: string; summary: string }>
> {
  const posts: Array<{
    id: string;
    title: string;
    date: string;
    summary: string;
  }> = [];
  let page = 1;
  for (;;) {
    const html = await fetchText(
      page === 1 ? `${BLOG_URL}` : `${BLOG_URL}?page=${page}`,
    );
    const $ = cheerio.load(html);

    let found = 0;
    $('div.postTitle a.postTitle2').each((_, el) => {
      const href = $(el).attr('href') || '';
      const idMatch = href.match(/\/p\/(\d+)/);
      if (!idMatch) return;
      const id = idMatch[1];
      const title = $(el).text().trim();
      const container = $(el).closest('div.day');
      const date =
        container
          .find('div.postDesc')
          .text()
          .match(/posted @ (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/)?.[1] ??
        container.find('div.dayTitle a').first().text().trim() ??
        '';
      const summary = container
        .find('div.c_b_p_desc')
        .first()
        .text()
        .trim()
        .replace(/^摘要：?\s*/, '')
        .replace(/阅读全文\s*$/, '')
        .trim();
      posts.push({ id, title, date, summary });
      found++;
    });

    if (found === 0) break;

    const next = $('a')
      .filter((_, a) => $(a).text().trim() === '下一页')
      .attr('href');
    if (!next) break;
    page++;
    await sleep(150);
  }
  return posts;
}

/** Unescape LaTeX delimiters that turndown may have escaped, outside code fences. */
function fixLatexDelimiters(md: string): string {
  const lines = md.split('\n');
  let inFence = false;
  const out: string[] = [];
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence) {
      out.push(
        line
          .replace(/\\\\\(/g, '\\(')
          .replace(/\\\\\)/g, '\\)')
          .replace(/\\\\\[/g, '\\[')
          .replace(/\\\\\]/g, '\\]'),
      );
    } else {
      out.push(line);
    }
  }
  return out.join('\n');
}

/** Convert a post body HTML string to markdown. */
function htmlToMarkdown(
  html: string,
  imgUrlRewrite: (src: string) => string,
): string {
  const $ = cheerio.load(html);

  // pull out code blocks first (preserve language + content verbatim)
  const codeBlocks: string[] = [];
  $('pre').each((_, el) => {
    const $pre = $(el);
    const $code = $pre.find('code').first();
    const lang =
      ($code.attr('class') || '').match(/language-([\w+#-]+)/)?.[1] || '';
    const text = $code.text().replace(/\n$/, '');
    codeBlocks.push(`\`\`\`${lang}\n${text}\n\`\`\``);
    $pre.replaceWith(`@@CODEBLOCK${codeBlocks.length - 1}@@`);
  });

  // rewrite image srcs (download later by caller)
  $('img').each((_, el) => {
    const $img = $(el);
    const src = $img.attr('src') || $img.attr('data-original') || '';
    if (!src) return;
    $img.attr('src', imgUrlRewrite(src));
  });

  const td = new TurndownService({
    codeBlockStyle: 'fenced',
    fence: '```',
    headingStyle: 'atx',
    bulletListMarker: '-',
  });
  td.keep(['del']);

  let md = td.turndown($.html());

  // restore code blocks
  md = md.replace(/@@CODEBLOCK(\d+)@@/g, (_, idx) => {
    const block = codeBlocks[Number(idx)];
    return block === undefined ? '' : `\n\n${block}\n\n`;
  });

  // remove excessive blank lines
  md = md.replace(/\n{4,}/g, '\n\n\n');
  return fixLatexDelimiters(md).trim() + '\n';
}

function sanitizeBasename(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
  return clean || 'image';
}

function toAbsoluteUrl(src: string): string {
  if (src.startsWith('//')) return `https:${src}`;
  if (/^https?:\/\//.test(src)) return src;
  return src;
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buf);
    return true;
  } catch {
    return false;
  }
}

/** Derive a readable, filesystem-safe filename base from a post title. */
function derivePostFilename(title: string): string {
  const name = title
    .replace(/[\\/:*?"<>|]/g, (c) => (c === ':' ? '-' : ''))
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.+$/, '');
  return name || 'post';
}

/** Pick the first clean paragraph from markdown body for the description. */
function deriveDescription(md: string, maxLen = 150): string {
  for (const line of md.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (/^#{1,6}\s/.test(t)) continue;
    if (/^```/.test(t)) continue;
    if (/^\s*[-*+]\s/.test(t)) continue;
    if (/^\s*\d+\.\s/.test(t)) continue;
    if (/^[|>]/.test(t)) continue;
    if (
      /[{};]/.test(t) ||
      /^#(include|define|pragma)/.test(t) ||
      /std::|::|=>/.test(t)
    )
      continue;
    const clean = t
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_~]{1,2}([^*_~]*)[*_~]{1,2}/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (clean.includes('\\(') || clean.includes('$')) continue;
    if (clean.length > 0) return clean.slice(0, maxLen);
  }
  return '';
}

async function main() {
  const whitelist = JSON.parse(
    await fs.readFile(WHITELIST_FILE, 'utf-8'),
  ) as Array<{ id: string; categories: string[]; tags: string[] }>;

  console.log('Crawling blog list...');
  const allPosts = await crawlList();
  const byId = new Map(allPosts.map((p) => [p.id, p]));
  const selected = whitelist.filter((w) => byId.has(w.id));
  console.log(
    `Found ${allPosts.length} posts on cnblogs, ${selected.length} whitelisted.`,
  );

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  // Idempotency: skip posts whose `link: cnblogs-<id>` already exists in source/posts
  // (robust to file renames).
  const existingLinks = new Set<string>();
  for (const f of await fs.readdir(POSTS_DIR)) {
    if (!f.endsWith('.md')) continue;
    const content = await fs.readFile(new URL(f, POSTS_DIR), 'utf-8');
    const linkMatch = content.match(/^link:\s*["']?([^"'\s]+)/m);
    if (linkMatch) existingLinks.add(linkMatch[1]);
  }

  for (const item of selected.slice(0, limit)) {
    const meta = byId.get(item.id)!;
    const slug = `cnblogs-${item.id}`;
    const fileBase = derivePostFilename(meta.title);
    if (existingLinks.has(slug)) {
      console.log(`  skip ${item.id} (already migrated)`);
      skipped++;
      continue;
    }

    const outFile = new URL(`${fileBase}.md`, POSTS_DIR);

    try {
      const html = await fetchText(`${BLOG_URL}/p/${item.id}`);
      const $ = cheerio.load(html);
      const body = $('div#cnblogs_post_body').first();
      if (!body.length) {
        console.log(`  WARN ${item.id}: empty body`);
        failed++;
        continue;
      }

      const imgMap = new Map<string, string>();
      const imgUrls: string[] = [];
      body.find('img').each((_, el) => {
        const src = toAbsoluteUrl(
          $(el).attr('src') || $(el).attr('data-original') || '',
        );
        if (!src || imgMap.has(src)) return;
        let base = sanitizeBasename(path.basename(new URL(src).pathname));
        if (!/\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(base)) base += '.png';
        const name = `${imgMap.size + 1}-${base}`;
        // encodeURI keeps `/` and Chinese, encodes spaces/parens so the
        // markdown `![alt](url)` parses correctly.
        imgMap.set(src, encodeURI(`/img/posts/${fileBase}/${name}`));
        imgUrls.push(src);
      });

      const rewrite = (src: string): string => {
        const abs = toAbsoluteUrl(src);
        return imgMap.get(abs) ?? abs;
      };
      const md = htmlToMarkdown($.html(body), rewrite);

      const description = deriveDescription(md);
      const frontmatter = [
        '---',
        `title: ${JSON.stringify(meta.title)}`,
        `date: ${JSON.stringify(meta.date)}`,
        `link: ${JSON.stringify(slug)}`,
        description ? `description: ${JSON.stringify(description)}` : null,
        `tags:`,
        ...item.tags.map((t) => `  - ${JSON.stringify(t)}`),
        `categories:`,
        ...item.categories.map((c) => `  - ${JSON.stringify(c)}`),
        '---',
        '',
      ]
        .filter((line) => line !== null)
        .join('\n');

      await fs.writeFile(outFile, `${frontmatter}\n${md}`);

      // download images
      let imgOk = 0;
      for (let i = 0; i < imgUrls.length; i++) {
        const localUrl = imgMap.get(imgUrls[i])!;
        const destPath = fileURLToPath(
          new URL(localUrl.replace(/^\/img\/posts\//, ''), IMG_ROOT),
        );
        const okImg = await downloadImage(imgUrls[i], destPath);
        if (okImg) imgOk++;
        else console.log(`  WARN ${item.id}: failed to download ${imgUrls[i]}`);
        await sleep(120);
      }

      console.log(
        `  ok ${item.id} "${meta.title}" (${imgOk}/${imgUrls.length} images)`,
      );
      ok++;
    } catch (error) {
      console.error(`  ERR ${item.id}:`, (error as Error).message);
      failed++;
    }
    await sleep(200);
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed}`);
}

void main();
