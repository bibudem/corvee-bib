import { URL } from 'url'
import { BrowsingContextStore } from '../../corvee/packages/harvester/lib'
import { console, inspect } from '../../corvee/packages/core'

export function addContexts(records, browsingContexts) {

  const browsingContextStore = new BrowsingContextStore(browsingContexts)

  records.forEach(record => {
    if (
      record.parent.startsWith('https://api.bib.umontreal.ca/guides/embed/')
      && (
        typeof record.browsingContextStack === 'undefined'
        || record.browsingContextStack.length === 0
      )
    ) {
      const parentUrl = new URL(record.parent)
      let tab = ''
      if (parentUrl.searchParams.has('tab')) {
        tab = parentUrl.searchParams.get('tab')
        parentUrl.searchParams.delete('tab')
      }
      let browsingContextStack = browsingContextStore.getContext(parentUrl.href)
      if (tab) {
        browsingContextStack = browsingContextStack.map(browsingContext => {
          return browsingContext = browsingContext.map(url => {
            url = new URL(url)
            url.searchParams.set('tab', tab)
            return url.href
          })
        })
      }

      record.browsingContextStack = browsingContextStack
    }
  })

  return records
}

//
//
//
if (require.main === module) {
  addContexts()
}