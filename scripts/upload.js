import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import { db } from '../config/local.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { console, inspect } from 'corvee-core'

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --job=2022-09-01')
  .demandOption(['job'])
  .alias('j', 'job')
  .help()
  .argv

const job = argv.job
const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')

const records = JSON.parse(await readFile(join(dataDir, `${job}_processed.json`)))

const client = new MongoClient(db.url, db.options)

const insertToLinksAggregation = [
  {
    $match: {
      $expr: {
        $and: [
          { $eq: ['$job', '$$job'] }
        ]
      }
    },
  },
  {
    $set: {
      messages: {
        $reduce: {
          input: '$reports',
          initialValue: '',
          in: {
            $concat: [
              '$$value',
              '<msg error-code="',
              '$$this.code',
              '">',
              '$$this.message',
              '</msg>',
            ],
          },
        },
      },
    },
  },
  {
    $set: {
      errorCodes: {
        $map: {
          input: '$reports',
          in: {
            $concat: ['$$this.code'],
          },
        },
      },
    },
  },
  {
    $set: {
      linkId: '$id',
      action: 'to-be-fixed',
    },
  },
  {
    $set: {
      status: {
        $switch: {
          branches: [
            {
              case: {
                $in: ['error', '$reports.level'],
              },
              then: 'error',
            },
            {
              case: {
                $in: [
                  'warning',
                  '$reports.level',
                ],
              },
              then: 'warning',
            },
          ],
          default: 'info',
        },
      },
    },
  },
  {
    $unset: [
      '_id',
      'contentLength',
      'created',
      'httpStatusCode',
      'httpStatusText',
      'id',
      'size',
      'trials',
      'level',
      '_from',
      '_filtered',
      'timing',
      'isNavigationRequest',
      'redirectChain',
      'resourceType',
      'reports',
    ],
  },
  {
    $merge: {
      into: 'links',
      whenMatched: 'replace'
    }
  }
]

async function run() {
  try {

    const reportsColl = client.db(db.name).collection('reports')
    const linksColl = client.db(db.name).collection('links')

    console.log(`Read ${records.length} records from job ${job}.`)

    console.log(`Deleting actual records for job ${job} from the records collection...`)

    const deleteRecordsResult = await reportsColl.deleteMany({ job })

    if (!deleteRecordsResult.acknowledged) {
      throw new Error(`Could not delete records for job ${job} from the reports collection.`)
    }

    console.log(`Deleted ${deleteRecordsResult.deletedCount} records from the reports collection.`)

    console.log(`Inserting ${records.length} records into the reports collection...`)

    const insertRecordsResult = await reportsColl.insertMany(records)

    if (!insertRecordsResult.acknowledged) {
      throw new Error(`Could not insert records for job ${job} from the reports collection.`)
    }

    console.log(`Inserted ${insertRecordsResult.insertedCount} records into the reports collection.`)

    console.log(`Deleting actual records for job ${job} from the links collection...`)

    const deleteLinksResult = await linksColl.deleteMany({ job })

    if (!deleteLinksResult.acknowledged) {
      throw new Error(`Could not delete records for job ${job} from the links collection.`)
    }

    console.log(`Deleted ${deleteLinksResult.deletedCount} records from the links collection.`)

    console.log('Creating link records in the links collection...')

    // const insertLinksCursor = reportsColl.aggregate(insertToLinksAggregation, { let: { job } })
    reportsColl.aggregate([
      // {
      //   $match: {
      //     $expr: {
      //       $and: [
      //         { $eq: ['$job', job] }
      //       ]
      //     }
      //   },
      // },
      {
        $set: {
          messages: {
            $reduce: {
              input: '$reports',
              initialValue: '',
              in: {
                $concat: [
                  '$$value',
                  '<msg error-code="',
                  '$$this.code',
                  '">',
                  '$$this.message',
                  '</msg>',
                ],
              },
            },
          },
        },
      },
      {
        $set: {
          errorCodes: {
            $map: {
              input: '$reports',
              in: {
                $concat: ['$$this.code'],
              },
            },
          },
        },
      },
      {
        $set: {
          linkId: '$id',
          action: 'to-be-fixed',
        },
      },
      {
        $set: {
          status: {
            $switch: {
              branches: [
                {
                  case: {
                    $in: ['error', '$reports.level'],
                  },
                  then: 'error',
                },
                {
                  case: {
                    $in: [
                      'warning',
                      '$reports.level',
                    ],
                  },
                  then: 'warning',
                },
              ],
              default: 'info',
            },
          },
        },
      },
      {
        $unset: [
          // '_id',
          'contentLength',
          'created',
          'httpStatusCode',
          'httpStatusText',
          'id',
          'size',
          'trials',
          'level',
          '_from',
          '_filtered',
          'timing',
          'isNavigationRequest',
          'redirectChain',
          'resourceType',
          'reports',
        ],
      },
      {
        $merge: {
          into: 'links',
          whenMatched: 'replace'
        }
      }
    ])

    const countInsertedLinks = await linksColl.countDocuments({ job })

    console.log(`Inserted ${countInsertedLinks} records into the links collection.`)

    // console.log(`Deleting records for job ${job}`)

    // await index.deleteBy({
    //   filters: `job:${job}`
    // })

    // console.log(`Deleted.`)

    // console.log(`Saving ${pageSnippetsIndex.length} new pages snippets for job ${job}`)

    // console.log(`Saved.`)

    console.log(`Finished.`)
  } finally {
    await client.close()
  }

}

run().catch(console.dir)