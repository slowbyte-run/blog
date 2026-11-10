/**
 * 博客园 MetaWeblog 封装：只暴露同步需要的那几个方法。
 *
 * 所有写入操作都串行执行并带节流，避免触发博客园的频率限制。
 */
import {
  createRpcClient,
  RpcFault,
  type RpcStruct,
  type RpcValue,
} from './xmlrpc';
import { BLOG_APP, RPC_ENDPOINT } from './config';
import type { PostPayload } from './transform';

export interface RemotePost {
  postid: string;
  title: string;
  description: string;
  categories: string[];
  keywords: string;
  dateCreated: string;
  permalink: string;
  link: string;
}

export interface RemotePostInput {
  title: string;
  description: string;
  categories: string[];
  mt_keywords: string;
  mt_excerpt: string;
}

export interface CnblogsClientOptions {
  username: string;
  token: string;
  endpoint?: string;
  blogApp?: string;
  /** 两次写操作之间的最小间隔，单位毫秒。 */
  minIntervalMs?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

function asRecord(value: RpcValue): RpcStruct | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value;
}

function str(value: RpcValue | undefined): string {
  return typeof value === 'string' ? value : '';
}

function strList(value: RpcValue | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function toRemotePost(value: RpcValue): RemotePost | null {
  const record = asRecord(value);
  if (!record) return null;
  const postid = record.postid;
  const id =
    typeof postid === 'string'
      ? postid
      : typeof postid === 'number'
        ? String(postid)
        : '';
  if (!id) return null;
  return {
    postid: id,
    title: str(record.title),
    description: str(record.description),
    categories: strList(record.categories),
    keywords: str(record.mt_keywords),
    dateCreated: str(record.dateCreated),
    permalink: str(record.permalink),
    link: str(record.link),
  };
}

// 博客园限制「1 分钟内只能发布 20 篇博文」，命中后必须等满一分钟再试。
const FREQUENCY_HINTS = ['频繁', '频率', '太快', '稍后', '分钟', 'too many'];

/** 当日发布额度用尽：重试没有意义，必须等额度恢复。 */
export class DailyQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DailyQuotaError';
  }
}

export function isDailyQuotaMessage(message: string): boolean {
  return /当日.*数量限制|超出当日/.test(message);
}

function isFrequencyFault(error: Error): boolean {
  if (!(error instanceof RpcFault)) return false;
  return FREQUENCY_HINTS.some((hint) => error.message.includes(hint));
}

export interface CnblogsClient {
  list(limit: number): Promise<RemotePost[]>;
  get(postid: string): Promise<RemotePost>;
  update(
    postid: string,
    payload: PostPayload,
    publish?: boolean,
  ): Promise<void>;
  /** publish=false 时创建为草稿，可绕过「当日发布数量」限制。 */
  create(payload: PostPayload, publish?: boolean): Promise<string>;
  /** 删除随笔，用于清理误建或测试留下的草稿。 */
  remove(postid: string): Promise<void>;
}

export function createCnblogsClient(
  options: CnblogsClientOptions,
): CnblogsClient {
  const {
    username,
    token,
    endpoint = RPC_ENDPOINT,
    blogApp = BLOG_APP,
    minIntervalMs = 3200,
    onRetry,
  } = options;

  const rpc = createRpcClient({ endpoint, onRetry });

  let lastWriteAt = 0;

  async function throttle() {
    const wait = minIntervalMs - (Date.now() - lastWriteAt);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastWriteAt = Date.now();
  }

  async function withFrequencyRetry<T>(run: () => Promise<T>): Promise<T> {
    let attempt = 0;
    for (;;) {
      try {
        return await run();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (isDailyQuotaMessage(err.message)) {
          throw new DailyQuotaError(err.message);
        }
        if (!isFrequencyFault(err) || attempt >= 6) throw err;
        attempt += 1;
        // 限流窗口是整分钟，等 65s 才能稳定越过。
        const waitMs = 65_000;
        onRetry?.(attempt, err);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        lastWriteAt = Date.now();
      }
    }
  }

  const list = async (limit: number): Promise<RemotePost[]> => {
    const raw = await rpc.call('metaWeblog.getRecentPosts', [
      blogApp,
      username,
      token,
      limit,
    ]);
    if (!Array.isArray(raw)) return [];
    return raw
      .map(toRemotePost)
      .filter((post): post is RemotePost => post !== null);
  };

  const get = async (postid: string): Promise<RemotePost> => {
    const raw = await rpc.call('metaWeblog.getPost', [postid, username, token]);
    const post = toRemotePost(raw);
    if (!post) throw new Error(`Unexpected getPost payload for ${postid}`);
    return post;
  };

  const update = async (
    postid: string,
    payload: PostPayload,
    publish = true,
  ) => {
    await throttle();
    await withFrequencyRetry(async () => {
      const struct: RpcStruct = {
        title: payload.title,
        description: payload.description,
        categories: payload.categories,
        mt_keywords: payload.mt_keywords,
        mt_excerpt: payload.mt_excerpt ?? '',
      };
      if (payload.dateCreated) struct.dateCreated = payload.dateCreated;
      await rpc.call('metaWeblog.editPost', [
        postid,
        username,
        token,
        struct,
        publish,
      ]);
    });
  };

  const create = async (
    payload: PostPayload,
    publish = true,
  ): Promise<string> => {
    await throttle();
    return withFrequencyRetry(async () => {
      const struct: RpcStruct = {
        title: payload.title,
        description: payload.description,
        categories: payload.categories,
        mt_keywords: payload.mt_keywords,
        mt_excerpt: payload.mt_excerpt ?? '',
      };
      if (payload.dateCreated) struct.dateCreated = payload.dateCreated;
      const raw = await rpc.call('metaWeblog.newPost', [
        blogApp,
        username,
        token,
        struct,
        publish,
      ]);
      const id =
        typeof raw === 'string'
          ? raw
          : typeof raw === 'number'
            ? String(raw)
            : '';
      if (!id) throw new Error('newPost did not return a post id');
      return id;
    });
  };

  const remove = async (postid: string): Promise<void> => {
    await throttle();
    const result = await withFrequencyRetry(() =>
      rpc.call('blogger.deletePost', [blogApp, postid, username, token, true]),
    );
    if (result !== true) {
      throw new Error(
        `deletePost returned ${JSON.stringify(result)} for ${postid}`,
      );
    }
  };

  return { list, get, update, create, remove };
}
