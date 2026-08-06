import { mermaidModule, setMermaidModule } from './state';

type MermaidTheme = 'default' | 'dark';

function getCurrentTheme(): MermaidTheme {
  const dataTheme =
    document.documentElement.getAttribute('data-theme') ??
    document.body?.getAttribute('data-theme');
  return dataTheme === 'dark' ? 'dark' : 'default';
}

export async function renderUnprocessedMermaidDiagrams(): Promise<void> {
  const diagrams = document.querySelectorAll<HTMLElement>(
    'pre.mermaid:not([data-processed])',
  );

  if (diagrams.length === 0) return;

  if (!mermaidModule) {
    const { default: mermaid } = await import('mermaid');
    setMermaidModule(mermaid);
  }

  if (!mermaidModule) return;

  mermaidModule.initialize({
    startOnLoad: false,
    theme: getCurrentTheme(),
    gitGraph: {
      mainBranchName: 'main',
      showCommitLabel: true,
      showBranches: true,
      rotateCommitLabel: true,
    },
  });

  for (const pre of diagrams) {
    if (!pre.hasAttribute('data-diagram')) {
      pre.setAttribute('data-diagram', pre.textContent || '');
    }

    const definition = pre.getAttribute('data-diagram') || '';
    const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;

    try {
      const { svg } = await mermaidModule.render(id, definition);
      pre.innerHTML = svg;
    } catch (error) {
      console.error('[mermaid-nav-fix] Error:', error);
    } finally {
      pre.setAttribute('data-processed', 'true');
    }
  }

  window.dispatchEvent(new CustomEvent('mermaid:rendered'));
}
