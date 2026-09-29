export function measureResponsiveHeaderLayout() {
  const header = document.querySelector("main header");
  const metadata = header?.firstElementChild;
  const headerRect = header?.getBoundingClientRect();
  const metadataRect = metadata?.getBoundingClientRect();
  const overflowingElements = [...document.querySelectorAll("body *")]
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && (rect.left < 0 || rect.right > window.innerWidth);
    })
    .slice(0, 8)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        className: element.className.toString().slice(0, 120),
        text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      };
    });

  return {
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    headerLeft: headerRect?.left ?? null,
    headerRight: headerRect?.right ?? null,
    metadataWidth: metadataRect?.width ?? null,
    overflowingElements,
  };
}

export function measureStickyNavLayout() {
  const chrome = document.querySelector("body > div > header");
  const navWrap = document.querySelector('nav[aria-label="Primary"]')?.parentElement;
  const availability = document.querySelector('[aria-live="polite"]');
  const chromeRect = chrome?.getBoundingClientRect();
  const navRect = navWrap?.getBoundingClientRect();

  const overlap = [...document.querySelectorAll('nav[aria-label="Primary"] a')].some((link) => {
    const rect = link.getBoundingClientRect();
    const availabilityRect = availability?.getBoundingClientRect();
    if (!availabilityRect) {
      return false;
    }

    return !(
      rect.right <= availabilityRect.left ||
      rect.left >= availabilityRect.right ||
      rect.bottom <= availabilityRect.top ||
      rect.top >= availabilityRect.bottom
    );
  });

  return {
    gap: chromeRect && navRect ? navRect.top - chromeRect.bottom : null,
    headerHeight: chromeRect?.height ?? null,
    chromeBg: chrome ? getComputedStyle(chrome).backgroundColor : null,
    overlap,
  };
}

export function isLanguageSwitcherClickable() {
  const languageLink = document.querySelector("header a[aria-label]");
  if (!languageLink) {
    return false;
  }

  const rect = languageLink.getBoundingClientRect();
  const element = document.elementFromPoint(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
  );

  return languageLink.contains(element) || languageLink === element;
}
