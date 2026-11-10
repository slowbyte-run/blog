/**
 * 极简 XML-RPC 客户端，只覆盖博客园 MetaWeblog 用到的取值类型。
 *
 * 没有引入 xmlrpc 之类的老库：本项目已有 cheerio，用它的 xmlMode 解析响应
 * 足够，且能避免再背一个无人维护的依赖。
 */
import * as cheerio from 'cheerio';

export type RpcValue =
  string | number | boolean | null | RpcValue[] | RpcStruct;

export interface RpcStruct {
  [key: string]: RpcValue;
}

export class RpcFault extends Error {
  constructor(
    message: string,
    readonly code: number,
  ) {
    super(message);
    this.name = 'RpcFault';
  }
}

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function escapeXml(value: string): string {
  return value.replace(/[&<>]/g, (char) => XML_ESCAPES[char] ?? char);
}

function encodeValue(value: RpcValue): string {
  if (value === null) return '<value><string></string></value>';
  if (typeof value === 'string') {
    return `<value><string>${escapeXml(value)}</string></value>`;
  }
  if (typeof value === 'boolean') {
    return `<value><boolean>${value ? 1 : 0}</boolean></value>`;
  }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? `<value><int>${value}</int></value>`
      : `<value><double>${value}</double></value>`;
  }
  if (Array.isArray(value)) {
    return `<value><array><data>${value.map(encodeValue).join('')}</data></array></value>`;
  }
  const members = Object.entries(value)
    .filter(([, v]) => v !== undefined)
    .map(
      ([name, v]) =>
        `<member><name>${escapeXml(name)}</name>${encodeValue(v)}</member>`,
    )
    .join('');
  return `<value><struct>${members}</struct></value>`;
}

export function buildRequest(method: string, params: RpcValue[]): string {
  const encoded = params
    .map((param) => `<param>${encodeValue(param)}</param>`)
    .join('');
  return `<?xml version="1.0" encoding="utf-8"?><methodCall><methodName>${escapeXml(method)}</methodName><params>${encoded}</params></methodCall>`;
}

/** cheerio 的调用签名比较宽，这里把外部节点统一收窄成它接受的入参类型。 */
type CheerioSelectorArg = Parameters<cheerio.CheerioAPI>[0];
const asNode = (el: unknown): CheerioSelectorArg => el as CheerioSelectorArg;

function decodeElement($: cheerio.CheerioAPI, el: unknown): RpcValue {
  const node = $(asNode(el));
  if (node.length === 0) return null;

  // <value> 里没有类型标签时，纯文本即字符串
  const typed = node.children().first();
  if (typed.length === 0) return node.text();

  const tag = String(typed.prop('tagName') ?? '').toLowerCase();
  switch (tag) {
    case 'string':
      return typed.text();
    case 'int':
    case 'i4':
    case 'i8':
      return Number.parseInt(typed.text().trim(), 10);
    case 'double':
      return Number.parseFloat(typed.text().trim());
    case 'boolean':
      return typed.text().trim() === '1';
    case 'datetime.iso8601':
    case 'datetime':
      return typed.text().trim();
    case 'base64':
      return Buffer.from(typed.text().replace(/\s+/g, ''), 'base64').toString(
        'utf8',
      );
    case 'nil':
      return null;
    case 'array': {
      const values = typed.children('data').children('value');
      return values.toArray().map((v) => decodeElement($, v));
    }
    case 'struct': {
      const out: RpcStruct = {};
      typed.children('member').each((_, member) => {
        const m = $(member);
        const name = m.children('name').first().text();
        const value = m.children('value').first();
        if (!name) return;
        out[name] = decodeElement($, value[0]);
      });
      return out;
    }
    default:
      return typed.text();
  }
}

/**
 * 解析 `<methodResponse>`。成功返回第一个 param 的值，fault 抛 RpcFault。
 */
export function parseResponse(xml: string): RpcValue {
  if (!/<methodResponse[\s>]/.test(xml)) {
    const snippet = xml.slice(0, 200).replace(/\s+/g, ' ');
    throw new RpcFault(`Unexpected response (not XML-RPC): ${snippet}`, -1);
  }

  const $ = cheerio.load(xml, { xmlMode: true });

  const fault = $('fault').first();
  if (fault.length > 0) {
    const decoded = decodeElement($, fault.children('value').first()[0]);
    const record =
      decoded && typeof decoded === 'object' && !Array.isArray(decoded)
        ? decoded
        : ({} as RpcStruct);
    const code = typeof record.faultCode === 'number' ? record.faultCode : -1;
    const message =
      typeof record.faultString === 'string'
        ? record.faultString
        : 'Unknown XML-RPC fault';
    throw new RpcFault(message, code);
  }

  const param = $('methodResponse > params > param > value').first();
  if (param.length > 0) return decodeElement($, param[0]);

  const loose = $('params > param').first();
  if (loose.length > 0) return decodeElement($, loose[0]);

  throw new RpcFault('Malformed XML-RPC response: no value node', -1);
}

export interface RpcClientOptions {
  endpoint: string;
  timeoutMs?: number;
  retries?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface RpcClient {
  call: (method: string, params: RpcValue[]) => Promise<RpcValue>;
}

export function createRpcClient(options: RpcClientOptions): RpcClient {
  const { endpoint, timeoutMs = 20_000, retries = 2, onRetry } = options;

  const call = async (
    method: string,
    params: RpcValue[],
  ): Promise<RpcValue> => {
    const body = buildRequest(method, params);
    let lastError: Error = new Error('XML-RPC call was never attempted');

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'text/xml; charset=utf-8',
            'user-agent': 'astro-snow-cnblogs-sync/1.0',
          },
          body,
          signal: AbortSignal.timeout(timeoutMs),
        });

        const text = await response.text();

        if (!response.ok && !text.includes('<methodResponse')) {
          throw new Error(
            `HTTP ${response.status} ${response.statusText}: ${text.slice(0, 160)}`,
          );
        }

        return parseResponse(text);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        lastError = err;
        // fault 是业务错误，重试没有意义
        if (err instanceof RpcFault && err.code !== -1) throw err;
        if (attempt === retries) break;
        onRetry?.(attempt + 1, err);
        await new Promise((resolve) =>
          setTimeout(resolve, 500 * (attempt + 1)),
        );
      }
    }

    throw lastError;
  };

  return { call };
}
