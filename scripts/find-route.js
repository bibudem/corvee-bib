#!/usr/bin/env

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, basename } from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const y = yargs(hideBin(process.argv))

const argv = y
  .wrap(Math.min(125, y.terminalWidth()))
  .usage('Usage: $0 <options> <url>')
  .example('npm run find-route -- --job=2022-09-01 http://www.example.com', 'Trouve la route du robot vers le lien http://www.example.com')
  .example('node $0 --job=2022-09-01 http://www.example.com', 'Même commande que la précédente, mais en passant par node')
  .demandOption(['job'])
  .alias('j', 'job')
  .help()
  .argv

const pageUrl = argv._[0]
const job = argv.job

const baseDir = join(basename(fileURLToPath(import.meta.url)), '..')
const jobFilePath = join(baseDir, 'data', `${job}_harvested.json`)
const jobData = JSON.parse(await readFile(jobFilePath, 'utf-8'))

function findParents(url, level, chain = []) {

  const record = jobData.find(record => {
    if (level) {
      return record.url === url && record.level === level
    }

    return record.url === url
  })

  if (!record) {
    return chain
  }

  chain.unshift(record.parent)

  return findParents(record.parent, record.level - 1, chain)
}

console.log(findParents(pageUrl))
