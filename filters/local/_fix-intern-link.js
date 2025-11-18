import { PseudoUrls } from '@corvee/core'
import { harvesterConfig } from '../../config/harvester.js'

const sitePseudoURLs = new PseudoUrls(harvesterConfig.internLinks)

export default {
  code: 'fix-intern-link',
  test: (report) => {
    if (report.finalUrl) {
      const isExtern = !sitePseudoURLs.matches(report.finalUrl)
      if (report.extern === isExtern) {
        return false
      }

      report.oldExtern = report.extern
      report.extern = isExtern
      return true
    }

    return false

  },
  level: 'info'
}