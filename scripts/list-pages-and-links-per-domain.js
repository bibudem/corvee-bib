import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { table } from 'table'
import { PseudoUrls } from '@corvee/core'
import { harvesterConfig } from '../config/harvester.js'

const sitePseudoURLs = new PseudoUrls(harvesterConfig.internLinks)

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --job=2025-11-13')
  .demandOption(['job'])
  .alias('j', 'job')
  .help()
  .argv

const job = argv.job

async function main() {

  const jobFileURL = new URL(`../data/${job}_harvested.json`, import.meta.url)

  console.log(`Listing pages and links per domain for job ${job}...`)

  const { default: data } = await import(jobFileURL, { with: { type: 'json' } })

  const internalDomains = new Map()
  const externalDomains = new Set()


  data.forEach(record => {
    try {
      new URL(record.finalUrl)
    } catch (e) {
      return
    }

    try {
      const isIntern = sitePseudoURLs.matches(record.finalUrl)
      if (isIntern) {

        const parentDomain = (new URL(record.parent)).hostname

        if (!internalDomains.has(parentDomain)) {
          internalDomains.set(parentDomain, 0)
        }

        internalDomains.set(parentDomain, internalDomains.get(parentDomain) + 1)
      } else {
        externalDomains.add((new URL(record.finalUrl)).hostname)
      }

    } catch (e) {
      return
    }

  })

  const result = { internalDomains: Array.from(internalDomains).sort((a, b) => b[1] - a[1]), externalDomains: Array.from(externalDomains).sort() }

  return result
}

const { internalDomains, externalDomains } = await main()
console.log(table(internalDomains))
console.log(`\nTotal unique internal domains: ${internalDomains.length}`)
console.log(JSON.stringify(externalDomains))
console.log(`\nTotal unique external domains: ${externalDomains.length}`)