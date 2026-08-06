function processLine(line: string): string {
  let start = 0;
  const len = line.length;
  const firstChar = line.charCodeAt(0);

  if (firstChar === 35) {
    while (start < len && line.charCodeAt(start) === 35) start++;
    while (start < len && line.charCodeAt(start) === 32) start++;
  } else if (firstChar === 45 || firstChar === 42 || firstChar === 43) {
    start = 1;
    while (start < len && line.charCodeAt(start) === 32) start++;
  } else if (firstChar === 62) {
    start = 1;
    while (start < len && line.charCodeAt(start) === 32) start++;
  } else if (firstChar >= 48 && firstChar <= 57) {
    while (
      start < len &&
      line.charCodeAt(start) >= 48 &&
      line.charCodeAt(start) <= 57
    ) {
      start++;
    }
    if (start < len && line.charCodeAt(start) === 46) start++;
    while (start < len && line.charCodeAt(start) === 32) start++;
  }

  if (start > 0) line = line.slice(start);

  let hasSpecialChars = false;
  for (let i = 0; i < line.length; i++) {
    const code = line.charCodeAt(i);
    if (
      code === 91 ||
      code === 96 ||
      code === 42 ||
      code === 95 ||
      code === 126 ||
      code === 60
    ) {
      hasSpecialChars = true;
      break;
    }
  }

  if (hasSpecialChars) {
    if (line.indexOf('[') >= 0) {
      line = line.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1');
    }
    if (line.indexOf('`') >= 0) {
      line = line.replace(/`[^`]*`/g, '');
    }
    if (line.indexOf('*') >= 0 || line.indexOf('_') >= 0) {
      line = line.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
    }
    if (line.indexOf('<') >= 0) {
      line = line.replace(/<[^>]*>/g, '');
    }
  }

  return line.trim();
}

export function extractTextFromMarkdown(
  content: string,
  maxLength: number = 150,
): string {
  if (!content) return '';

  let idx = 0;
  const len = content.length;

  if (
    content.charCodeAt(0) === 45 &&
    content.charCodeAt(1) === 45 &&
    content.charCodeAt(2) === 45
  ) {
    idx = 4;
    while (idx < len - 3) {
      if (
        content.charCodeAt(idx) === 10 &&
        content.charCodeAt(idx + 1) === 45 &&
        content.charCodeAt(idx + 2) === 45 &&
        content.charCodeAt(idx + 3) === 45
      ) {
        idx += 4;
        break;
      }
      idx++;
    }
  }

  const searchEnd = Math.min(idx + maxLength * 5, len);
  let result = '';
  let resultLen = 0;
  const targetLen = maxLength + 50;
  let lineStart = idx;
  let inCodeBlock = false;

  while (idx < searchEnd && resultLen < targetLen) {
    const char = content.charCodeAt(idx);
    if (char === 10) {
      if (idx > lineStart) {
        const line = content.slice(lineStart, idx).trim();
        if (line.length > 0) {
          if (
            line.charCodeAt(0) === 96 &&
            line.charCodeAt(1) === 96 &&
            line.charCodeAt(2) === 96
          ) {
            inCodeBlock = !inCodeBlock;
          } else if (!inCodeBlock) {
            const firstChar = line.charCodeAt(0);
            if (firstChar !== 124 && firstChar !== 58) {
              const processed = processLine(line);
              if (processed.length >= 3) {
                if (resultLen > 0) result += ' ';
                result += processed;
                resultLen += processed.length + 1;
              }
            }
          }
        }
      }
      lineStart = idx + 1;
    }
    idx++;
  }

  if (lineStart < searchEnd && resultLen < targetLen && !inCodeBlock) {
    const line = content
      .slice(lineStart, Math.min(lineStart + 200, searchEnd))
      .trim();
    if (line.length >= 3) {
      const processed = processLine(line);
      if (processed.length >= 3) {
        if (resultLen > 0) result += ' ';
        result += processed;
      }
    }
  }

  if (result.length > maxLength) {
    let cutIdx = maxLength;
    const minCut = Math.floor(maxLength * 0.8);
    while (cutIdx > minCut && result.charCodeAt(cutIdx) !== 32) cutIdx--;
    result = result.slice(0, cutIdx) + '...';
  }

  return result;
}
