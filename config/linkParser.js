export function linkParser() {
  return Array
      .from(/** @type {NodeListOf<HTMLAnchorElement>} */(document.querySelectorAll('a[href]')))
      // Exclude those inside a rss module
      .filter(link => !(link.parentNode && link.parentNode instanceof HTMLAnchorElement && link.closest('.s-lg-rss')))
      .map(link => ({
          url: link.href,
          text: link.tagName === 'IMG' ? link.getAttribute('alt') : link.innerText,
          urlData: link.getAttribute('href'),
          isNavigationRequest: true
      }))
      .concat(Array
          .from(/** @type {NodeListOf<HTMLImageElement>} */(document.querySelectorAll('img[src]')))
          .map(img => ({
              url: img.src,
              text: img.alt || img.title || null,
              urlData: img.getAttribute('src'),
              isNavigationRequest: false
          }))
      )
}