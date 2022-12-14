import { writeFile, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import algoliasearch from 'algoliasearch'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { console, inspect } from 'corvee-core'
import { BrowsingContextStore } from 'corvee-harvester'
import sectionsData from '../config/sections.js'

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --job=2022-09-01')
  .demandOption(['job'])
  .alias('j', 'job')
  .help()
  .argv

const job = argv.job
const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')

const outFilePath = join(dataDir, `${job}_page-index.json`)

const records = JSON.parse(await readFile(join(dataDir, `${job}_processed.json`)))
const browsingContexts = JSON.parse(await readFile(join(dataDir, `${job}_browsing-contexts.json`)))
const pageSnippets = JSON.parse(await readFile(join(dataDir, `${job}_page-snippets.json`)))
const browsingContextStore = new BrowsingContextStore(browsingContexts)

const recordsPages = new Set()

records.forEach(record => {

  const pageUrl = record.browsingContextStack ? record.browsingContextStack.flat(2)[0] : record.parent

  if (shouldIgnoreUrl(pageUrl)) {
    return
  }

  recordsPages.add(pageUrl)

})

const sections = sectionsData
  .map(section => section.sections)
  .flat()
  .map(section => {
    return {
      key: section.key,
      matches: url => {
        let urls = section.urls
        if (section.urls.length === 1 && section.urls[0] === '') {
          urls = sectionsData
            .map(section => section.sections)
            .flat()
            .map(section => section.urls)
            .flat()
            .filter(url => url !== '')
        }

        return urls.some(urlPrefix => url.startsWith(urlPrefix))
      }
    }
  })

// TEMPORAIRE
import { harvesterConfig } from '../config/harvester.js'
import { isRegExp, isFunction } from 'underscore'
function shouldIgnoreUrl(url) {
  const self = this;

  function doCheck(url) {
    if (harvesterConfig.ignore.length === 0) {
      return false;
    }

    return harvesterConfig.ignore.find(testUrl => {
      if (typeof testUrl === 'string') {
        return url.includes(testUrl);
      }
      if (isRegExp(testUrl)) {
        return testUrl.test(url)
      }
      if (isFunction(testUrl)) {
        return testUrl(url)
      }
    })
  }

  const shouldIgnore = doCheck(url);

  if (shouldIgnore) {
    console.verbose(`Ignoring url <${url}> based on rule ${shouldIgnore}`)
  }

  return shouldIgnore;
}

function hash(string) {
  return createHash('sha1').update(string).digest('hex').slice(0, 10)
}

function getSectionKeys(url) {
  const keys = []
  for (const section of sections) {
    if (section.matches(url)) {
      keys.push(section.key)
    }
  }
  return keys.length > 0 ? keys : null
}

const pagesToRemove = new Set()
const pagesToAdd = new Set()
const guides = new Map()

let pageSnippetsIndex = []

pageSnippets.forEach(pageSnippet => {

  if (shouldIgnoreUrl(pageSnippet.url)) {
    pagesToRemove.add(pageSnippet.url)
    return
  }

  if (/\?tab=([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])(?:$|#|&)/.test(pageSnippet.url)) {
    pagesToRemove.add(pageSnippet.url)
    return
  }

  if (pageSnippet.url.startsWith('https://api.bib.umontreal.ca/guides/embed/')) {
    pagesToRemove.add(pageSnippet.url)
    const context = browsingContextStore.getContext(pageSnippet.url)
    if (context) {
      const parentUrl = context.flat()[0]
      pagesToRemove.add(parentUrl)

      const guidePageUrl = new URL(context)
      guidePageUrl.hash = ''
      const guideCanonicalUrl = new URL(context)
      guideCanonicalUrl.search = ''
      guideCanonicalUrl.hash = ''

      const titleArray = pageSnippet.title.split(' - ')
      const title = titleArray.pop()
      const subTitle = titleArray.join(' - ')

      let guideSnippet
      if (!guides.has(guideCanonicalUrl.href)) {
        guideSnippet = structuredClone(pageSnippet)
        guideSnippet.url = guideCanonicalUrl.href
        guideSnippet.pages = []

        guides.set(guideCanonicalUrl.href, guideSnippet)
      } else {
        guideSnippet = guides.get(guideCanonicalUrl.href)
      }

      if (!guidePageUrl.searchParams.has('tab')) {
        // This is a guide welcome page
        guideSnippet.text = pageSnippet.text
        guideSnippet.title = title
        guideSnippet.pages.unshift(subTitle)
      } else {
        // This is a guide page
        guideSnippet.pages.push(subTitle)
      }

    }
    return
  }

})

pageSnippets.forEach(pageSnippet => {
  if (!pagesToRemove.has(pageSnippet.url) && recordsPages.has(pageSnippet.url)) {
    pageSnippetsIndex.push(pageSnippet)
  }
})

pageSnippetsIndex.push(...pagesToAdd.values())
guides.forEach(guide => {
  if (guide.pages) {
    guide.pages = [...(new Set(guide.pages))]
  }
})
pageSnippetsIndex.push(...guides.values())

pageSnippetsIndex = pageSnippetsIndex.reduce((pageSnippets, pageSnippet) => {

  const sections = getSectionKeys(pageSnippet.url)

  if (sections) {
    pageSnippet.sections = sections
    pageSnippet.text = pageSnippet.text.slice(0, 200)
    pageSnippet.key = hash(pageSnippet.url)
    pageSnippet.objectID = pageSnippet.key
    pageSnippet.job = job
    pageSnippets.push(pageSnippet)
  }

  return pageSnippets
}, [])

pageSnippetsIndex.sort((a, b) => {
  if (a.url < b.url) {
    return -1
  }

  if (a.url > b.url) {
    return 1
  }

  return 0
})

writeFile(outFilePath, JSON.stringify(pageSnippetsIndex, null, 2))

const client = algoliasearch('DVUHFZXXNR', '2b2f762335ac4dd4698b6088f91f8332')
const index = client.initIndex('bib_udem_corvee')

console.log(`Deleting records for job ${job}`)

await index.deleteBy({
  filters: `job:${job}`
})

console.log(`Deleted.`)

console.log(`Saving ${pageSnippetsIndex.length} new pages snippets for job ${job}`)

await index.saveObjects(pageSnippetsIndex)

console.log(`Saved.`)

console.log(`Finished.`)

