import { PseudoUrls } from '@corvee/core'
import { harvesterConfig } from '../config/harvester.js'

const sitePseudoURLs = new PseudoUrls(harvesterConfig.internLinks)

/**
 * @param {import("@corvee/harvester").Harvester} harvester
 * @param {string} job
 * @param {{ (record: any): boolean; (arg0: any): any; }} [filter]
 */
export async function fixExtern(record) {
  try {
    if (
      record.redirectChain
      && record.redirectChain.length > 0
      && record.finalUrl
    ) {
      const isExtern = !sitePseudoURLs.matches(record.finalUrl)
      if (record.extern === isExtern) {
        return false
      }

      record.oldExtern = record.extern
      record.extern = isExtern
      return true
    }
  } catch (error) {
    console.error('Error in fixExtern:', error)
  }
}