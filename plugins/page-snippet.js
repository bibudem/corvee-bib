import { console } from 'corvee-core'

export default {
  name: 'page-snippet',
  emits: true,
  /**
   * @this import('corvee-harvester').Harvester
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

        if (/https:\/\/api\.bib\.umontreal\.ca\/guides\/embed\/\d+(\?|$)/.test(url)) {
          text = (await page.$eval('#s-lg-guide-main', node => node.innerText)).slice(0, 200)
        } else {
          try {
            text = (await page.$eval('.content-main', node => node.innerText)).slice(0, 200)
          } catch {
            // failed to find element matching selector ".content-main"
            text = (await page.$eval('body', node => node.innerText)).slice(0, 200)
          }
        }

        return Promise.resolve({ url, title, text })

      } catch (error) {
        return Promise.reject(error)
      }
    }
    return Promise.resolve(false)
  }
}