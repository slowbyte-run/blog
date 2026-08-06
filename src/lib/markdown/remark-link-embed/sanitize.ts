import sanitizeHtml from 'sanitize-html';

export function sanitizeText(text: string): string {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return sanitizeHtml(url, {
      allowedTags: [],
      allowedAttributes: {},
    });
  } catch {
    return '';
  }
}
