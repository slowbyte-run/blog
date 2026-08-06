import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { renderMarkdown } from '../src/lib/markdown';

const ABOUT_PAGE_PATH = 'src/pages/blog/about.md';

describe('about markdown content', () => {
  it('should render about intro section', async () => {
    const source = await readFile(ABOUT_PAGE_PATH, 'utf-8');
    const { content } = matter(source);
    const html = await renderMarkdown(content);

    expect(html).toContain('slowbyte');
    expect(html).toContain('<h2>🧰 关注的方向</h2>');
    expect(html).toContain('<h2>📫 联系我</h2>');
  });
});
