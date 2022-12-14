import { createHash } from 'node:crypto'
import { console, inspect } from 'corvee-core'
import sectionsData from '../config/sections.js'

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

/**
 * @param {import('corvee-harvester').RecordType} record
 */
export function addSections(record) {

  const pageUrl = record.browsingContextStack ? record.browsingContextStack.flat(2)[0] : record.parent
  const sections = getSectionKeys(pageUrl)

  if (sections) {
    record.sections = sections
  }
}


