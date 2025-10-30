import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { console, inspect } from '@corvee/core'
import { fetchGuides } from '../lib/fetch-guides.js'

const inputFile = join('data', '2022-10-05_harvested.json')

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

console.log('Processing LibGuides guides...')

libGuides.forEach(guide => aliasIndex.set(guide.url, guide.aliasUrl))

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

data
  .filter(record => {
    return record.url
      && /https:\/\/api\.bib\.umontreal\.ca\/guides\/embed\/\d+(?:$|\?)/i.test(record.url)
      && record.httpStatusCode === 200
  })
  .forEach(record => {

    const url = record.url
    const guideUrl = url.split('?')[0]

    if (!guidesList.has(guideUrl)) {
      guidesList.set(guideUrl, new Set())
    }

    if (url.indexOf('?') > -1 && !isAliasFor(guideUrl, url)) {
      guidesList.get(guideUrl).add(url)
    }
  })

console.log(`Processing done. Got ${guidesList.size} guides from Guides API.`)

console.log(`guides size: ${guidesList.size}`)
console.log(`libGuides size: ${libGuidesList.size}`)

libGuidesList.forEach((pages, guideUrl) => {
  if (guidesList.has(guideUrl)) {

    same.push(guideUrl)

    // let isStrictSame = pages.size === guidesList.get(guideUrl).size ? true : false

    // if (isStrictSame) {
    //   pages.forEach(page => {
    //     if (!guidesList.has(page)) {
    //       isStrictSame = false

    //     }
    //   })
    // }

    const isStrictSame = JSON.stringify([...pages.values()].sort()) === JSON.stringify([...guidesList.get(guideUrl).values()].sort())

    if (isStrictSame) {
      strictSame.push({
        url: guideUrl,
        guide: [...guidesList.get(guideUrl).values()].sort(),
        libGuide: [...pages.values()].sort()
      })
    } else {
      if (pages.size === guidesList.get(guideUrl).size) {
        console.log(inspect([...guidesList.get(guideUrl).values()]))
        console.log(inspect([...pages.values()]))
        process.exit()
      }
      strictDifferent.push({
        url: guideUrl,
        guide: [...guidesList.get(guideUrl).values()].sort(),
        libGuide: [...pages.values()].sort()
      })
    }

  } else {
    different.push(guideUrl)
  }
})

console.log(`Same: ${same.length}`)
console.log(`Different: ${different.length}`)
console.log(`Strict same size: ${strictSame.length}`)
console.log(`Strict different size: ${strictDifferent.length}`)
console.log(`Strict different pages: ${inspect(strictDifferent)}`)

console.log(`Different url: ${inspect(different)}`)

