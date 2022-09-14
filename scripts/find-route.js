#!/usr/bin/env

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, basename } from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --job=2022-09-01 http://www.example.com')
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
