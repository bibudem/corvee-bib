import esMain from 'es-main'
import ProgressBar from 'progress'

import { BrowsingContextStore } from 'corvee-harvester'
import { console, inspect } from 'corvee-core'

export function addContexts(records, browsingContexts) {

  const browsingContextStore = new BrowsingContextStore(browsingContexts)
  const progressBar = new ProgressBar('[:bar] :percent :etas', { total: records.length, width: 60 })

  records.forEach(record => {

    progressBar.tick()

    if (
      record.parent.startsWith('https://api.bib.umontreal.ca/guides/embed/')
      && (
        !record.browsingContextStack
        || record.browsingContextStack.length === 0
      )
    ) {
      const parentUrl = new URL(record.parent)
      let tab = ''

      if (parentUrl.searchParams.has('tab')) {
        tab = parentUrl.searchParams.get('tab')
        parentUrl.search = ''
        parentUrl.hash = ''
      }

      let browsingContextStack = browsingContextStore.getContext(parentUrl.href)
      if (tab && browsingContextStack) {
        browsingContextStack = browsingContextStack.map(browsingContext => {
          return browsingContext = browsingContext.map(url => {
            url = new URL(url)
            url.searchParams.set('tab', tab)
            return url.href
          })
        })

        record.browsingContextStack = browsingContextStack
      }
    }
  })

  return records
}

//
//
//
if (esMain(import.meta)) {
  addContexts()
}