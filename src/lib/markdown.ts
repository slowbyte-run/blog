import { remark } from 'remark';
import html from 'remark-html';

export async function renderMarkdown(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
