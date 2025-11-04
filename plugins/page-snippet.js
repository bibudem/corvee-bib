import { console } from '@corvee/core'

const TEXT_SNIPPET_MAX_LENGTH = 175

export default {
  name: 'page-snippet',
  emits: true,
  /**
   * @this import('@corvee/harvester').Harvester
   * 
  */
  onNavigationResponse: async function getPageSnippet({ page, response }) {
    if (
      response.ok()
      && response.request().resourceType() === 'document'
      && this.isInternLink(response.url())
      && !this.shouldIgnoreUrl(response.url())
      && response.headers()['content-type']
      && response.headers()['content-type'].startsWith('text/html')
    ) {
      try {
        const url = page.url()
        const title = await page.title()
        let text = ''

        try {
          if (url.startsWith('https://boite-outils.bib.umontreal.ca/')) {
            text = (await page.evaluate('#s-lg-guide-main', node => node.innerText)).slice(0, TEXT_SNIPPET_MAX_LENGTH)
          }

          else if (url.startsWith('https://studio.bib.umontreal.ca/')) {
            text = (await page.evaluate('article, main', node => node.innerText)).slice(0, TEXT_SNIPPET_MAX_LENGTH)
          }
          else if (url.startsWith('https://bib.umontreal.ca/')) {
            text = (await page.evaluate('#content-main', node => node.innerText)).slice(0, TEXT_SNIPPET_MAX_LENGTH)
          } else {
            text = (await page.evaluate('body', node => node.innerText)).slice(0, TEXT_SNIPPET_MAX_LENGTH)
          }
        } catch {
          console.warn(`Could not extract snippet for ${url}`)
        }

        return Promise.resolve({ url, title, text })

      } catch (error) {
        return Promise.reject(error)
      }
    }
    return Promise.resolve(false)
  }
}