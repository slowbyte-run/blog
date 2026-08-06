import type { CurrentHeading } from '../useCurrentHeading';

export function createHeadingStore(offsetTop: number) {
  let currentHeading: CurrentHeading | null = null;
  const listeners = new Set<() => void>();
  let observer: IntersectionObserver | null = null;
  const visibleHeadings = new Map<
    string,
    { top: number; element: HTMLElement }
  >();

  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };

  const updateHeading = (newHeading: CurrentHeading | null) => {
    if (currentHeading?.id !== newHeading?.id) {
      currentHeading = newHeading;
      notifyListeners();
    }
  };

  const updateCurrentHeading = () => {
    if (visibleHeadings.size === 0) return;

    let closestId = '';
    let closestTop = Number.POSITIVE_INFINITY;
    let closestElement: HTMLElement | null = null;

    visibleHeadings.forEach(({ top, element }, id) => {
      if (top < closestTop) {
        closestTop = top;
        closestId = id;
        closestElement = element;
      }
    });

    if (closestElement && closestId) {
      const element = closestElement as HTMLElement;
      const level = parseInt(element.tagName.substring(1), 10) as 2 | 3;
      updateHeading({
        id: closestId,
        text: element.textContent?.trim() || '',
        level,
      });
    }
  };

  const setupObserver = () => {
    if (observer) observer.disconnect();

    visibleHeadings.clear();
    currentHeading = null;

    const article =
      document.querySelector('.custom-content') ??
      document.querySelector('article');
    if (!article) return;

    const rootMargin = `-${offsetTop}px 0px -70% 0px`;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const id = element.id;
          if (!id) continue;

          if (entry.isIntersecting) {
            visibleHeadings.set(id, {
              top: entry.boundingClientRect.top,
              element,
            });
          } else {
            visibleHeadings.delete(id);
          }
        }
        updateCurrentHeading();
      },
      { rootMargin, threshold: 0 },
    );

    const headings = Array.from(
      article.querySelectorAll<HTMLElement>('h2, h3'),
    ).filter((heading) => !heading.closest('.link-preview-block'));

    headings.forEach((heading) => {
      if (heading.id) observer?.observe(heading);
    });

    if (headings.length > 0 && visibleHeadings.size === 0) {
      requestAnimationFrame(() => {
        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          const rect = heading.getBoundingClientRect();
          if (rect.top < offsetTop && heading.id) {
            const level = parseInt(heading.tagName.substring(1), 10) as 2 | 3;
            updateHeading({
              id: heading.id,
              text: heading.textContent?.trim() || '',
              level,
            });
            break;
          }
        }
      });
    }
  };

  const handlePageLoad = () => {
    visibleHeadings.clear();
    currentHeading = null;
    requestAnimationFrame(() => {
      setupObserver();
    });
  };

  return {
    subscribe: (listener: () => void) => {
      if (listeners.size === 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setupObserver();
          });
        });
        document.addEventListener('astro:page-load', handlePageLoad);
      }

      listeners.add(listener);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          document.removeEventListener('astro:page-load', handlePageLoad);
          visibleHeadings.clear();
        }
      };
    },
    getSnapshot: () => currentHeading,
    getServerSnapshot: () => null,
  };
}
