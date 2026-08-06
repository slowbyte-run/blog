import { useStore } from '@nanostores/react';
import { drawerOpen } from '@store/ui';
import { useCallback, useMemo, useState, type CSSProperties } from 'react';

export default function FloatingGroup() {
  const isDrawerOpen = useStore(drawerOpen);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  const floatingStyle = useMemo<CSSProperties>(
    () =>
      isDrawerOpen
        ? { transform: 'translateX(200%)', opacity: 0, pointerEvents: 'none' }
        : {},
    [isDrawerOpen],
  );

  return (
    <div
      id="floating-nav"
      className="text-primary fixed right-4 bottom-4 z-50 flex flex-col gap-2"
      data-expanded={String(isExpanded)}
      style={floatingStyle}>
      <div
        id="nav-content"
        className="flex scale-y-100 flex-col gap-2 opacity-100">
        <button
          id="scroll-to-top"
          className="bg-background/80 hover:bg-background rounded-full p-2 shadow-lg backdrop-blur-sm transition-colors duration-200"
          aria-label="回到顶部"
          title="回到顶部"
          suppressHydrationWarning
          data-tooltip-interactive="false"
          data-tooltip-placement="left"
          onClick={scrollToTop}>
          <i className="fa-solid fa-angle-up text-lg" aria-hidden="true" />
        </button>
        <button
          id="scroll-to-bottom"
          className="bg-background/80 hover:bg-background rounded-full p-2 shadow-lg backdrop-blur-sm transition-colors duration-200"
          aria-label="滚到底部"
          title="滚到底部"
          suppressHydrationWarning
          data-tooltip-interactive="false"
          data-tooltip-placement="left"
          onClick={scrollToBottom}>
          <i className="fa-solid fa-angle-down text-lg" aria-hidden="true" />
        </button>
      </div>

      <button
        id="toggle-nav"
        className="flex-center bg-background/80 hover:bg-background size-9 rounded-full shadow-lg backdrop-blur-sm transition-colors duration-200"
        aria-label="展开/收起工具栏"
        title="展开/收起工具栏"
        suppressHydrationWarning
        aria-expanded={isExpanded}
        data-tooltip-interactive="false"
        data-tooltip-placement="left"
        onClick={handleToggle}>
        <i
          className={`fa-solid fa-wand-magic-sparkles menu-nav-icon text-sm transition-transform duration-300 ${
            isExpanded ? 'hidden' : ''
          }`}
          aria-hidden="true"
        />
        <i
          className={`fa-solid fa-xmark close-nav-icon text-sm transition-transform duration-300 ${
            isExpanded ? '' : 'hidden'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
