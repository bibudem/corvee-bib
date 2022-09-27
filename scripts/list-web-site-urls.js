#!/usr/bin/env

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, basename } from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --job=2022-09-01')
  .demandOption(['job'])
  .alias('j', 'job')
  .help()
  .argv

const job = argv.job

const urls = new Set()

const baseDir = join(basename(fileURLToPath(import.meta.url)), '..')
const jobFilePath = join(baseDir, 'data', `${job}_harvested.json`)
const outFilePath = join(baseDir, `${job}_site-links.txt`)

console.log(`Loading file ${jobFilePath}`)

const jobData = JSON.parse(await readFile(jobFilePath, 'utf-8'))

console.log('Finding links...')

jobData.forEach(record => {
  if (!record.extern && record.) {
    urls.add(record.url)
  }
})

await writeFile(outFilePath, [...urls.values()].sort().join('\n'))

console.log(`Found ${urls.size} links.`)
