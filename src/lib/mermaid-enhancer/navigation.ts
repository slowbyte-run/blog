import { renderUnprocessedMermaidDiagrams } from './render';
import {
  navFixSetup,
  setNavFixSetup,
  setThemeObserver,
  themeObserver,
} from './state';

export function setupMermaidNavFix(): void {
  if (navFixSetup) return;

  document.addEventListener('astro:after-swap', () => {
    requestAnimationFrame(() => {
      void renderUnprocessedMermaidDiagrams();
    });
  });

  if (themeObserver) {
    themeObserver.disconnect();
  }

  const observer = new MutationObserver(() => {
    document
      .querySelectorAll<HTMLElement>('pre.mermaid[data-processed]')
      .forEach((diagram) => diagram.removeAttribute('data-processed'));
    void renderUnprocessedMermaidDiagrams();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  setThemeObserver(observer);
  setNavFixSetup(true);
}
