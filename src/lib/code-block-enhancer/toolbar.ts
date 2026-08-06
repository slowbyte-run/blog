export interface ToolbarOptions {
  enableCopy?: boolean;
  enableFullscreen?: boolean;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, '');
}

export function createToolbar(
  language: string,
  options: ToolbarOptions = {},
): string {
  const { enableCopy = true, enableFullscreen = true } = options;
  const safeLanguage = escapeHtml(language);

  const fullscreenBtn = enableFullscreen
    ? `
        <button
          class="code-block-button code-block-fullscreen"
          aria-label="全屏查看"
          title="全屏查看"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
        </button>`
    : '';

  const copyBtn = enableCopy
    ? `
        <button
          class="code-block-button code-block-copy"
          aria-label="复制代码"
          title="复制代码"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
            <path d="M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z"/>
          </svg>
        </button>`
    : '';

  return `
    <div class="code-block-toolbar">
      <div class="code-block-dots">
        <span class="code-block-dot red"></span>
        <span class="code-block-dot yellow"></span>
        <span class="code-block-dot green"></span>
        <span class="code-block-language">${safeLanguage}</span>
      </div>
      <div class="code-block-actions">
        ${fullscreenBtn}
        ${copyBtn}
      </div>
    </div>
  `;
}
