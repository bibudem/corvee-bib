import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchGuides } from '../lib/fetch-guides.js'
import { console } from '../../corvee/packages/core/index.js'

fetchGuides()
  .then(links => {
    const linksFilePath = join(import.meta.url, '..', 'config', 'links.json')
    writeFileSync(linksFilePath, JSON.stringify(links, null, 2))
    console.info(`${links.length} links saved to ${linksFilePath}`)
    process.exit()
  })
  .catch(error => {
    console.error(error)
  })