import { readFile, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import yargs from 'yargs'
import { addContexts } from '../lib/add-contexts.js'
import { console, inspect } from '@corvee/core'

const today = new Date()
const year = today.getFullYear()
const month = `${today.getMonth() + 1}`.padStart(2, '0')
const day = `${today.getDate()}`.padStart(2, '0')

const defaultJob = `${year}-${month}-${day}`

const argv = yargs
  .options({
    j: {
      alias: 'job',
      default: defaultJob,
      describe: `Job id. Defaults to today\'s date: ${defaultJob}`,
      type: 'string'
    },
    r: {
      alias: 'resume',
      default: false,
      type: 'boolean',
      describe: 'Resumes a previously stoped job. Requires --job options.',
      implies: 'j'
    }
  })
  .help()
  .argv

const job = argv.job
const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data',)
const processedFileName = join(dataDir, `${job}_processed.json`)
const addedContextFileName = join(dataDir, `${job}_processed-with-added-contexts.json`)
const browsingContexts = JSON.parse(await readFile(dataDir, `${job}_browsing-contexts.json`))
const records = JSON.parse(await readFile(processedFileName))

const results = addContexts(records, browsingContexts)

writeFileSync(addedContextFileName, JSON.stringify(results, null, 2))
