import sanitizeHtml from 'sanitize-html';

export { extractTextFromMarkdown } from './sanitize/markdown-text';

export const getSanitizeHtml = (html: string) => {
  return sanitizeHtml(html, {
    textFilter: (text) =>
      text.replace(
        /[^\t\n\r\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm,
        '',
      ),
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  });
};
