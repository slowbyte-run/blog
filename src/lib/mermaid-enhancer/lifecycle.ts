import { enhanceMermaidDiagram, isAlreadyWrapped } from './toolbar';
import {
  activeObservers,
  activeTimeouts,
  mermaidRenderedHandler,
  setMermaidRenderedHandler,
} from './state';

export function cleanup(): void {
  for (const observer of activeObservers) {
    observer.disconnect();
  }
  activeObservers.length = 0;

  for (const timeout of activeTimeouts) {
    clearTimeout(timeout);
  }
  activeTimeouts.length = 0;

  if (mermaidRenderedHandler) {
    window.removeEventListener('mermaid:rendered', mermaidRenderedHandler);
    setMermaidRenderedHandler(null);
  }
}

export function waitAndEnhance(): void {
  const mermaidElements = document.querySelectorAll('pre.mermaid');

  mermaidElements.forEach((element) => {
    const mermaidElement = element as HTMLElement;

    if (
      mermaidElement.dataset.toolbarEnhanced === 'true' ||
      isAlreadyWrapped(mermaidElement)
    ) {
      return;
    }

    if (mermaidElement.getAttribute('data-processed') === 'true') {
      enhanceMermaidDiagram(mermaidElement);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-processed' &&
          mermaidElement.getAttribute('data-processed') === 'true'
        ) {
          enhanceMermaidDiagram(mermaidElement);
          obs.disconnect();
          const index = activeObservers.indexOf(obs);
          if (index > -1) {
            activeObservers.splice(index, 1);
          }
          return;
        }
      }
    });

    observer.observe(mermaidElement, {
      attributes: true,
      attributeFilter: ['data-processed'],
    });

    activeObservers.push(observer);

    const timeout = setTimeout(() => {
      observer.disconnect();
      const obsIndex = activeObservers.indexOf(observer);
      if (obsIndex > -1) {
        activeObservers.splice(obsIndex, 1);
      }
      const timeoutIndex = activeTimeouts.indexOf(timeout);
      if (timeoutIndex > -1) {
        activeTimeouts.splice(timeoutIndex, 1);
      }
      if (
        mermaidElement.dataset.toolbarEnhanced !== 'true' &&
        !isAlreadyWrapped(mermaidElement)
      ) {
        enhanceMermaidDiagram(mermaidElement);
      }
    }, 5000);

    activeTimeouts.push(timeout);
  });
}

export function registerMermaidRenderedHandler(): void {
  const handler = () => {
    setTimeout(waitAndEnhance, 50);
  };
  setMermaidRenderedHandler(handler);
  window.addEventListener('mermaid:rendered', handler);
}
