export function getSelectableItems(): HTMLElement[] {
  const results = Array.from(
    document.querySelectorAll<HTMLElement>('.pagefind-ui__result'),
  );
  const loadMoreBtn = document.querySelector<HTMLElement>(
    '.pagefind-ui__button',
  );

  if (loadMoreBtn && loadMoreBtn.offsetParent !== null) {
    return [...results, loadMoreBtn];
  }
  return results;
}
