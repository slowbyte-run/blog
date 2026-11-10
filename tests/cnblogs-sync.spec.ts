import { describe, expect, it } from 'vitest';
import {
  absolutizeMarkdown,
  buildExcerpt,
  buildPayload,
  isPayloadApplied,
} from '../scripts/lib/cnblogs/transform';
import {
  buildCreateCategories,
  normalizeCategories,
  normalizeDate,
  parseCnblogsIdFromLink,
  type LocalPost,
} from '../scripts/lib/cnblogs/posts';
import {
  buildRequest,
  parseResponse,
  RpcFault,
} from '../scripts/lib/cnblogs/xmlrpc';
import { isDailyQuotaMessage } from '../scripts/lib/cnblogs/remote';
import { classifyVisibility } from '../scripts/lib/cnblogs/status';

function makePost(overrides: Partial<LocalPost> = {}): LocalPost {
  return {
    key: 'XCPC/Algorithm/Graph/LCA.md',
    absPath: '/repo/source/posts/XCPC/Algorithm/Graph/LCA.md',
    title: 'LCA 算法',
    slug: 'lca',
    date: '2025-06-11T21:27:00+08:00',
    description: 'LCA 的倍增实现',
    tags: ['algorithm', 'graph'],
    categoryPaths: [['XCPC', 'Algorithm', 'Graph']],
    body: '## 定义\n\n$O(N \\log N)$ 的预处理。',
    draft: false,
    linkedCnblogsId: null,
    ...overrides,
  };
}

describe('absolutizeMarkdown', () => {
  const origin = 'https://blog.novaspace.me';

  it('rewrites local image paths in markdown syntax', () => {
    expect(absolutizeMarkdown('![](/img/a.png)', origin)).toBe(
      `![](${origin}/img/a.png)`,
    );
    expect(absolutizeMarkdown('![x](/img/a.png "标题")', origin)).toBe(
      `![x](${origin}/img/a.png "标题")`,
    );
  });

  it('rewrites html src attributes', () => {
    expect(absolutizeMarkdown('<img src="/img/b.png" />', origin)).toBe(
      `<img src="${origin}/img/b.png" />`,
    );
  });

  it('rewrites internal post links but not external ones', () => {
    expect(absolutizeMarkdown('[上一篇](/blog/post/foo)', origin)).toBe(
      `[上一篇](${origin}/blog/post/foo)`,
    );
    expect(
      absolutizeMarkdown(
        '[外链](https://blog.novaspace.me/blog/post/foo)',
        origin,
      ),
    ).toBe('[外链](https://blog.novaspace.me/blog/post/foo)');
  });

  it('leaves math and code untouched', () => {
    const body = '$a_i + b^2$\n\n```cpp\nint x = 1;\n```';
    expect(absolutizeMarkdown(body, origin)).toBe(body);
  });
});

describe('normalizeCategories', () => {
  it('treats a flat array as separate single-level paths', () => {
    expect(normalizeCategories(['XCPC', 'Algorithm'])).toEqual([
      ['XCPC'],
      ['Algorithm'],
    ]);
  });

  it('keeps a nested array as one path', () => {
    expect(normalizeCategories([['XCPC', 'Algorithm', 'Graph']])).toEqual([
      ['XCPC', 'Algorithm', 'Graph'],
    ]);
  });

  it('drops invalid entries instead of throwing', () => {
    expect(
      normalizeCategories([42, '', null, [' Graph ', 7]] as unknown[]),
    ).toEqual([['Graph']]);
  });

  it('returns an empty list for non-array input', () => {
    expect(normalizeCategories(undefined)).toEqual([]);
    expect(normalizeCategories('XCPC')).toEqual([]);
  });
});

describe('buildCreateCategories', () => {
  it('always includes the markdown marker', () => {
    expect(buildCreateCategories([], false)).toEqual(['[Markdown]']);
  });

  it('adds joined category paths only when asked', () => {
    const paths = [['XCPC', 'Algorithm', 'Graph']];
    expect(buildCreateCategories(paths, false)).toEqual(['[Markdown]']);
    expect(buildCreateCategories(paths, true)).toEqual([
      '[Markdown]',
      'XCPC/Algorithm/Graph',
    ]);
  });
});

describe('normalizeDate', () => {
  it('handles Date instances produced by YAML', () => {
    expect(normalizeDate(new Date('2025-06-11T21:27:00+08:00'))).toBe(
      '2025-06-11T21:27:00+08:00',
    );
  });

  it('handles the quoted "YYYY-MM-DD HH:mm" form', () => {
    expect(normalizeDate('2025-06-11 21:27')).toBe('2025-06-11T21:27:00+08:00');
  });

  it('returns null for unusable values', () => {
    expect(normalizeDate('not-a-date')).toBeNull();
    expect(normalizeDate(undefined)).toBeNull();
    expect(normalizeDate({})).toBeNull();
  });
});

describe('parseCnblogsIdFromLink', () => {
  it('extracts the id from a cnblogs link', () => {
    expect(parseCnblogsIdFromLink('cnblogs-18924572')).toBe('18924572');
  });

  it('ignores regular slugs and empty values', () => {
    expect(parseCnblogsIdFromLink('codeforces-1027')).toBeNull();
    expect(parseCnblogsIdFromLink('')).toBeNull();
    expect(parseCnblogsIdFromLink(null)).toBeNull();
  });
});

describe('buildPayload', () => {
  it('keeps remote categories so the markdown marker survives', () => {
    const payload = buildPayload(makePost(), {
      keepCategories: ['[Markdown]', 'Note'],
    });
    expect(payload.categories).toEqual(['[Markdown]', 'Note']);
  });

  it('adds the markdown marker when remote categories are empty', () => {
    const payload = buildPayload(makePost(), { keepCategories: [] });
    expect(payload.categories).toEqual(['[Markdown]']);
  });

  it('rewrites body links and drops tags unless opted in', () => {
    const post = makePost({ body: '![](/img/x.png)', tags: ['a', 'b'] });
    const payload = buildPayload(post);
    expect(payload.description).toContain(
      'https://blog.novaspace.me/img/x.png',
    );
    expect(payload.mt_keywords).toBe('');

    const withTags = buildPayload(post, { withTags: true });
    expect(withTags.mt_keywords).toBe('a, b');
  });
});

describe('buildExcerpt', () => {
  it('keeps short text as-is', () => {
    expect(buildExcerpt('一句话摘要')).toBe('一句话摘要');
  });

  it('truncates long text and collapses whitespace', () => {
    const long = 'word '.repeat(100);
    const excerpt = buildExcerpt(long, 20);
    expect(excerpt.length).toBe(21);
    expect(excerpt.endsWith('…')).toBe(true);
    expect(excerpt).not.toContain('  ');
  });
});

describe('isPayloadApplied', () => {
  const payload = buildPayload(makePost());

  it('treats identical content as applied', () => {
    expect(isPayloadApplied(payload, payload)).toBe(true);
  });

  it('ignores CRLF and surrounding whitespace differences', () => {
    expect(
      isPayloadApplied(payload, {
        title: payload.title,
        description: `${payload.description.replace(/\n/g, '\r\n')}\n\n`,
      }),
    ).toBe(true);
  });

  it('detects real changes', () => {
    expect(
      isPayloadApplied(payload, {
        title: payload.title,
        description: 'something else',
      }),
    ).toBe(false);
  });
});

describe('xmlrpc', () => {
  it('escapes values when building a request', () => {
    const xml = buildRequest('metaWeblog.getPost', ['1', 'a&b', '<c>']);
    expect(xml).toContain('a&amp;b');
    expect(xml).toContain('&lt;c&gt;');
    expect(xml).toContain('<methodName>metaWeblog.getPost</methodName>');
  });

  it('parses nested structs and arrays', () => {
    const xml = `<?xml version="1.0"?>
      <methodResponse><params><param><value><struct>
        <member><name>postid</name><value><string>42</string></value></member>
        <member><name>title</name><value><string>标题</string></value></member>
        <member><name>categories</name><value><array><data>
          <value><string>[Markdown]</string></value>
        </data></array></value></member>
        <member><name>count</name><value><int>3</int></value></member>
      </struct></value></param></params></methodResponse>`;

    const parsed = parseResponse(xml) as Record<string, unknown>;
    expect(parsed.postid).toBe('42');
    expect(parsed.title).toBe('标题');
    expect(parsed.categories).toEqual(['[Markdown]']);
    expect(parsed.count).toBe(3);
  });

  it('throws RpcFault with the server message on fault responses', () => {
    const xml = `<?xml version="1.0"?>
      <methodResponse><fault><value><struct>
        <member><name>faultCode</name><value><int>7</int></value></member>
        <member><name>faultString</name><value><string>参数有误</string></value></member>
      </struct></value></fault></methodResponse>`;

    expect(() => parseResponse(xml)).toThrowError(RpcFault);
    try {
      parseResponse(xml);
    } catch (error) {
      expect((error as RpcFault).code).toBe(7);
      expect((error as RpcFault).message).toBe('参数有误');
    }
  });

  it('rejects non XML-RPC responses', () => {
    expect(() => parseResponse('<html>502 Bad Gateway</html>')).toThrowError(
      RpcFault,
    );
  });
});

describe('isDailyQuotaMessage', () => {
  it('matches the cnblogs daily quota fault', () => {
    expect(isDailyQuotaMessage('发布失败！超出当日博文发布数量限制')).toBe(
      true,
    );
    expect(isDailyQuotaMessage('当日博文发布数量限制')).toBe(true);
  });

  it('does not confuse it with the per-minute limit', () => {
    expect(isDailyQuotaMessage('1 分钟内只能发布 20 篇博文')).toBe(false);
    expect(isDailyQuotaMessage('参数有误')).toBe(false);
  });
});

describe('classifyVisibility', () => {
  it('treats 200 as public', () => {
    expect(classifyVisibility(200, null)).toEqual({
      visibility: 'public',
      detail: '200',
    });
  });

  it('treats a redirect to signin as restricted (审核或私有)', () => {
    const result = classifyVisibility(
      302,
      'https://account.cnblogs.com/signin?ReturnUrl=x',
    );
    expect(result.visibility).toBe('restricted');
    expect(result.detail).toContain('signin');
  });

  it('treats 404 as missing', () => {
    expect(classifyVisibility(404, null)).toEqual({
      visibility: 'missing',
      detail: '404',
    });
  });

  it('treats other redirects as restricted without leaking the full url', () => {
    const result = classifyVisibility(
      301,
      'https://example.com/' + 'a'.repeat(100),
    );
    expect(result.visibility).toBe('restricted');
    expect(result.detail.length).toBeLessThan(80);
  });
});
