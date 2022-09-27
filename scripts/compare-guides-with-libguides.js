import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchGuides } from '../lib/fetch-guides.js'

const inputFile = join('data', '2022-09-20_harvested.json')

console.log('Starting...')

console.log(`Loading data file ${inputFile}`)

const data = JSON.parse(readFileSync(inputFile))

console.log('Loading done.')

const aliasIndex = new Map()

function isAliasFor(guideUrl, aliasUrl) {
  return aliasIndex.has(guideUrl) && aliasIndex.get(guideUrl) === aliasUrl
}

const same = []
const different = []
const strictSame = []
const strictDifferent = []
const guidesList = new Map()
const libGuidesList = new Map()

console.log('Fetching LibGuides guides...')

const libGuides = await fetchGuides()

console.log('Fetching done.')

libGuides.forEach(guide => aliasIndex.set(guide.url, guide.aliasUrl))

console.log('Processing LibGuides guides...')

libGuides.forEach(guide => {

  const guideUrl = guide.url
  if (!libGuidesList.has(guideUrl)) {
    libGuidesList.set(guideUrl, new Set())

  }
  guide.pages
    .filter(pageUrl => !isAliasFor(guideUrl, pageUrl))
    .forEach(pageUrl => libGuidesList.get(guideUrl).add(pageUrl))
})

console.log(`Processing done. Got ${libGuidesList.size} guides from LibGuides.`)

console.log('Processing guides...')

data.forEach(record => {
  if (record.url && /https:\/\/api\.bib\.umontreal\.ca\/guides\/embed\/\d+(?:$|\?)/.test(record.url)) {
    const url = record.url
    const guideUrl = url.split('?')[0]
    if (!guidesList.has(guideUrl)) {
      guidesList.set(guideUrl, new Set())
    }

    if (url.indexOf('?') > -1 && !isAliasFor(guideUrl, url)) {
      guidesList.get(guideUrl).add(url)
    }
  }
})

console.log(`Processing done. Got ${guidesList.size} guides from Guides API.`)

console.log(`guides size: ${guidesList.size}`)
console.log(`libGuides size: ${libGuidesList.size}`)

libGuidesList.forEach((pages, guide) => {
  if (guidesList.has(guide)) {
    same.push(guide)

    let isStrictSame = pages.size === guidesList.get(guide).size ? true : false

    if (isStrictSame) {
      pages.forEach(page => {
        if (!guidesList.has(page)) {
          isStrictSame = false

        }
      })
    }

    if (isStrictSame) {
      strictSame.push({
        url: guide,
        guide: [...guidesList.get(guide).values()].sort(),
        libGuide: [...libGuidesList.get(guide).values()].sort()
      })
    } else {
      strictDifferent.push({
        url: guide,
        guide: [...guidesList.get(guide).values()].sort(),
        libGuide: [...libGuidesList.get(guide).values()].sort()
      })
    }

  } else {
    different.push(guide)
  }
})

console.log(`Same: ${same.length}`)
console.log(`Different: ${different.length}`)
console.log(`Strict same: ${strictSame.length}`)
console.log(`Strict different: ${strictDifferent.length}`)
console.log(strictDifferent)

console.log(JSON.stringify(different, null, 2))

