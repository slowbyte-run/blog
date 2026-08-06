/**
 * 代码块增强工具
 * 为 Shiki 渲染的代码块添加 Mac 窗口风格工具栏。
 */

export type { CodeBlockInfo } from './code-block-enhancer/extractors';
export {
  extractLanguage,
  extractCode,
  extractCodeHTML,
  extractPreClassName,
  extractPreStyle,
  extractCodeClassName,
} from './code-block-enhancer/extractors';
export { copyToClipboard } from './code-block-enhancer/clipboard';
export {
  type ToolbarOptions,
  createToolbar,
} from './code-block-enhancer/toolbar';
export {
  type EnhanceOptions,
  enhanceCodeBlock,
  enhanceAllCodeBlocks,
} from './code-block-enhancer/enhance';
