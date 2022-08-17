import { writeFileSync } from 'fs'
import { join } from 'path'
import yargs from 'yargs'
import { addContexts } from '../lib/add-contexts'
import { console, inspect } from '../../corvee/packages/core/lib'

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
const browsingContexts = require(join(__dirname, '..', 'data', `${job}_browsing-contexts.json`))
const records = require(processedFileName)

const results = addContexts(records, browsingContexts)

writeFileSync(addedContextFileName, JSON.stringify(results, null, 2))
