import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { table } from 'table'

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --job=2025-11-13')
  .demandOption(['job'])
  .alias('j', 'job')
  .help()
  .argv

const job = argv.job

async function main() {

  const jobFileURL = new URL(`../data/${job}_harvested.json`, import.meta.url)

  console.log(`Listing links per internal domain for job ${job}...`)

  const { default: data } = await import(jobFileURL, { with: { type: 'json' } })

  const domains = new Map()

  data.forEach(record => {
    if (!record.extern) {

      try {
        const url = new URL(record.finalUrl)

        if (!domains.has(url.hostname)) {
          domains.set(url.hostname, 0)
        }

        const count = domains.get(url.hostname)
        domains.set(url.hostname, count + 1)
      } catch (e) {
        return
      }

    }
  })

  return Array.from(domains).sort((a, b) => b[1] - a[1])
}

const result = await main()
console.log(table(result))
console.log(`\nTotal unique internal domains: ${result.length}`)