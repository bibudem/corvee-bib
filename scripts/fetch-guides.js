import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchGuides } from '../lib/fetch-guides.js'
import { console } from 'corvee-core'

console.log('Fetching links...')

fetchGuides()
  .then(links => {
    const linksFilePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'config', 'links.json')
    writeFileSync(linksFilePath, JSON.stringify(links, null, 2))
    console.info(`${links.length} links saved to ${linksFilePath}`)
    process.exit()
  })
  .catch(error => {
    console.error(error)
  })