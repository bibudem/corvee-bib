import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchGuides } from '../lib/fetch-guides.js'

const inputFile = join('data', '2022-09-20_harvested.json')

console.log('Starting...')

console.log(`Loading data file ${inputFile}`)

const data = JSON.parse(readFileSync(inputFile))

console.log('Loading done.')

const same = []
const different = []
const guidesList = new Map()
const libGuidesList = new Map()

console.log('Fetching LibGuides guides...')

const libGuides = await fetchGuides()

console.log('Fetching done.')

console.log('Processing LibGuides guides...')

libGuides.forEach(url => {

  const guideUrl = url.split('?')[0]
  if (!libGuidesList.has(guideUrl)) {
    libGuidesList.set(guideUrl, new Set())
  }
  if (url.indexOf('?') > -1) {
    libGuidesList.get(guideUrl).add(url)
  }
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
    if (url.indexOf('?') > -1) {
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
  } else {
    different.push(guide)
  }
})

console.log(`Same: ${same.length}`)
console.log(`Different: ${different.length}`)

console.log(JSON.stringify(different, null, 2))

