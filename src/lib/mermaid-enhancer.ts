/**
 * Mermaid 图表增强入口
 * 组合导航修复、渲染与工具栏增强。
 */

import { setupMermaidNavFix } from './mermaid-enhancer/navigation';
import { renderUnprocessedMermaidDiagrams } from './mermaid-enhancer/render';
import {
  cleanup,
  registerMermaidRenderedHandler,
  waitAndEnhance,
} from './mermaid-enhancer/lifecycle';
import { activeTimeouts } from './mermaid-enhancer/state';

export function initMermaidEnhancer(): void {
  setupMermaidNavFix();
  cleanup();

  void renderUnprocessedMermaidDiagrams();

  const timeout = setTimeout(waitAndEnhance, 100);
  activeTimeouts.push(timeout);

  registerMermaidRenderedHandler();
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:before-swap', cleanup);
}
