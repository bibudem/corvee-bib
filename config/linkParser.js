export function linkParser() {

  function normalizeText(str) {
    if (typeof str !== 'string') {
      return str
    }

    return str.replace(/\n/g, '').trim()
  }

  // @ts-ignore
  function getNodeText(node) {
    let text = null

    if (!(node instanceof HTMLElement)) {
      return text
    }

    if (node.nodeName === 'A') {
      text = node.innerText
      if (!normalizeText(text) && node.querySelector('img[alt]')) {
        text = node.querySelector('img[alt]').getAttribute('alt')
      }

    } else if (node.nodeName === 'IMG') {
      if (node.hasAttribute('alt')) {
        text = node.getAttribute('alt')
      } else if (node.hasAttribute('title')) {
        text = node.getAttribute('title')
      }
    }

    return normalizeText(text)
  }

  return Array
    .from(/** @type {NodeListOf<HTMLAnchorElement>} */(document.querySelectorAll('a[href]')))
    // Exclude those inside a rss module
    .filter(link => !(link.parentNode && link.parentNode instanceof HTMLAnchorElement && link.closest('.s-lg-rss')))
    .map(link => (
      {
        url: link.href,
        text: getNodeText(link),
        urlData: link.getAttribute('href'),
        isNavigationRequest: true
      }
    ))
    .concat(Array
      .from(/** @type {NodeListOf<HTMLImageElement>} */(document.querySelectorAll('img[src]')))
      .map(img => ({
        url: img.src,
        text: getNodeText(img),
        urlData: img.getAttribute('src'),
        isNavigationRequest: false
      }))
    )
}
