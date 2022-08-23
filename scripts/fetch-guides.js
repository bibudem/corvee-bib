import { writeFileSync } from 'fs'
import { join } from 'path'
import { fetchGuides } from '../lib/fetch-guides'
import { console } from '../../corvee/packages/core'

fetchGuides()
  .then(links => {
    const linksFilePath = join(__dirname, '..', 'config', 'links.json')
    writeFileSync(linksFilePath, JSON.stringify(links, null, 2))
    console.info(`${links.length} links saved to ${linksFilePath}`)
    process.exit()
  })
  .catch(error => {
    console.error(error)
  })