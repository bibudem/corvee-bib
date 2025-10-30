import { createWriteStream } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as csv from 'fast-csv'

import { console, inspect } from '@corvee/core'

/**
 * @param {import("@corvee/harvester").Harvester} harvester
 * @param {string} jobId
 */
export function saveSystemInfo(harvester, jobId) {

  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')
  const fileName = join(dir, `${jobId}_system-info.csv`)

  const systemInfoStream = createWriteStream(fileName, {
    autoClose: false
  })

  const csvStream = csv.format({ headers: true })
  csvStream.pipe(systemInfoStream).on('end', () => process.exit())

  harvester.on('system-info', function (data) {
    csvStream.write(data)
  })

  harvester.on('end', function () {
    csvStream.end()
  })
}