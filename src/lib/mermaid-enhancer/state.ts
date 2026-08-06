export const activeObservers: MutationObserver[] = [];
export const activeTimeouts: ReturnType<typeof setTimeout>[] = [];
export let mermaidRenderedHandler: (() => void) | null = null;
export let mermaidModule: typeof import('mermaid').default | null = null;
export let navFixSetup = false;
export let themeObserver: MutationObserver | null = null;

export function setMermaidRenderedHandler(handler: (() => void) | null) {
  mermaidRenderedHandler = handler;
}

export function setMermaidModule(
  module: typeof import('mermaid').default | null,
) {
  mermaidModule = module;
}

export function setNavFixSetup(value: boolean) {
  navFixSetup = value;
}

export function setThemeObserver(observer: MutationObserver | null) {
  themeObserver = observer;
}
