export interface CodeBlockInfo {
  element: HTMLElement;
  language: string;
  code: string;
  codeHTML: string;
  preClassName: string;
  preStyle: string;
  codeClassName: string;
}

export function extractLanguage(preElement: HTMLElement): string {
  if (preElement.classList.contains('mermaid')) {
    return 'mermaid';
  }

  const dataLang = preElement.getAttribute('data-language');
  if (dataLang) {
    return dataLang;
  }

  const codeElement = preElement.querySelector('code');
  if (codeElement) {
    const classes = codeElement.className.split(' ');
    const langClass = classes.find((cls) => cls.startsWith('language-'));
    if (langClass) {
      return langClass.replace('language-', '');
    }
  }

  return 'text';
}

export function extractCode(preElement: HTMLElement): string {
  const codeElement = preElement.querySelector('code');
  return codeElement?.textContent || '';
}

export function extractCodeHTML(preElement: HTMLElement): string {
  const codeElement = preElement.querySelector('code');
  return codeElement?.innerHTML || '';
}

export function extractPreClassName(preElement: HTMLElement): string {
  return preElement.className;
}

export function extractPreStyle(preElement: HTMLElement): string {
  return preElement.getAttribute('style') || '';
}

export function extractCodeClassName(preElement: HTMLElement): string {
  const codeElement = preElement.querySelector('code');
  return codeElement?.className || '';
}
