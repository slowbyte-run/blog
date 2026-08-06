import { buildHeadingTree, EMPTY_HEADINGS } from './tree-utils';

export const headingCache = {
  key: '',
  headings: EMPTY_HEADINGS,
};

function buildHeadingKey(headings: typeof EMPTY_HEADINGS): string {
  return headings
    .map(
      (heading) =>
        `${heading.id}:${heading.level}:${heading.text}:${buildHeadingKey(heading.children)}`,
    )
    .join('|');
}

function getHeadingSnapshot() {
  if (typeof document === 'undefined') return [];

  const articleContent =
    document.querySelector('.custom-content') ??
    document.querySelector('article');
  if (!articleContent) return [];

  const headingElements = Array.from(
    articleContent.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'),
  ).filter((heading) => !heading.closest('.link-preview-block'));

  if (headingElements.length === 0) return [];

  return buildHeadingTree(
    headingElements.map((heading, index) => {
      let id = heading.id;
      if (!id) {
        const text = heading.textContent || '';
        id =
          text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim() || `heading-${index}`;
        heading.id = id;
      }

      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1), 10),
      };
    }),
  );
}

function refreshHeadingSnapshot(): boolean {
  const nextHeadings = getHeadingSnapshot();
  const nextKey = buildHeadingKey(nextHeadings);
  if (nextKey === headingCache.key) return false;
  headingCache.key = nextKey;
  headingCache.headings = nextHeadings;
  return true;
}

export function subscribe(callback: () => void) {
  if (typeof document === 'undefined') return () => {};

  let observer: MutationObserver | null = null;
  let rafId: number | null = null;
  let updateRafId: number | null = null;

  const scheduleUpdate = () => {
    if (updateRafId !== null) return;
    updateRafId = requestAnimationFrame(() => {
      updateRafId = null;
      if (refreshHeadingSnapshot()) callback();
    });
  };

  const setupObserver = () => {
    observer?.disconnect();

    const observerTarget =
      document.querySelector('.custom-content') ??
      document.querySelector('article');

    if (!observerTarget) {
      rafId = requestAnimationFrame(() => {
        setupObserver();
      });
      return;
    }

    observer = new MutationObserver(() => {
      scheduleUpdate();
    });
    observer.observe(observerTarget, { childList: true, subtree: true });
    refreshHeadingSnapshot();
    scheduleUpdate();
  };

  const articleContent =
    document.querySelector('.custom-content') ??
    document.querySelector('article');
  const hasHeadings = articleContent
    ? articleContent.querySelector('h1, h2, h3, h4, h5, h6')
    : null;

  if (articleContent && hasHeadings) {
    setupObserver();
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupObserver();
      });
    });
  }

  const handlePageLoad = () => {
    if (rafId) cancelAnimationFrame(rafId);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupObserver();
      });
    });
  };

  document.addEventListener('astro:page-load', handlePageLoad);
  document.addEventListener('astro:after-swap', handlePageLoad);

  const timeoutId = setTimeout(() => {
    scheduleUpdate();
  }, 100);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    if (updateRafId) cancelAnimationFrame(updateRafId);
    clearTimeout(timeoutId);
    observer?.disconnect();
    document.removeEventListener('astro:page-load', handlePageLoad);
    document.removeEventListener('astro:after-swap', handlePageLoad);
  };
}
