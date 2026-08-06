export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      console.error('Failed to copy:', err);
      return false;
    }
  }
}

export function createCopyCheckmarkSvg(prefix: string): string {
  const id = `${prefix}-${Date.now()}`;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <mask id="${id}">
        <g fill="none" stroke="#fff" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M2 13.5l4 4l10.75 -10.75">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/>
          </path>
          <path stroke="#000" stroke-width="6" d="M7.5 13.5l4 4l10.75 -10.75">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0"/>
          </path>
          <path d="M7.5 13.5l4 4l10.75 -10.75">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0"/>
          </path>
        </g>
      </mask>
      <rect width="24" height="24" fill="currentColor" mask="url(#${id})"/>
    </svg>`;
}
