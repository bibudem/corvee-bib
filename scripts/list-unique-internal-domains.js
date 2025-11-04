import { table } from 'table'
import data from '../data/2025-10-30_harvested.json' with { type: 'json' }

function main() {
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

const result = main()
console.log(table(result))
console.log(`\nTotal unique internal domains: ${result.length}`)