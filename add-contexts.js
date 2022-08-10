import { writeFileSync } from 'fs'
import { join } from 'path'
import yargs from 'yargs'
import { BrowsingContextStore } from '../corvee/packages/harvester'
import { console, inspect } from '../corvee/packages/core'

export function addContexts() {

  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');

  const defaultJob = `${year}-${month}-${day}`;

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
    .argv;

  const job = argv.job;
  const processedFileName = join(__dirname, '..', 'data', `${job}_processed.json`);
  const addedContextFileName = join(__dirname, '..', 'data', `${job}_processed-with-added-contexts.json`);
  const links = require('./config/links.json')
  const records = require(processedFileName)
  const browsingContextStore = new BrowsingContextStore(links)

  records.forEach(record => {
    if (
      record.parent.startsWith('https://api.bib.umontreal.ca/guides/embed/')
      && (
        typeof record.browsingContextStack === 'undefined'
        || record.browsingContextStack.length === 0
      )
    ) {
      const browsingContextStack = browsingContextStore.getContext(record.parent)
      record.browsingContextStack = browsingContextStack
    }
  })

  writeFileSync(addedContextFileName, JSON.stringify(records, null, 2))
}

//
//
//
if (require.main === module){
  addContexts()
}