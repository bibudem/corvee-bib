import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { table, getBorderCharacters } from 'table'
import colors from 'colors/safe.js'
import { CorveeProcessor } from '@corvee/processor'
import { addSections } from './lib/add-sections.js'
import { filters, messages } from './filters/index.js'
import { toSql } from './utils/to-sql.js'
// import { addContexts } from './lib/add-contexts.js'
import { console, inspect } from '@corvee/core'

const start = Date.now()
const today = new Date()
const year = today.getFullYear()
const month = `${today.getMonth() + 1}`.padStart(2, '0')
const day = `${today.getDate()}`.padStart(2, '0')

const defaultTodayDashedPrefix = `${year}-${month}-${day}`

const argv = yargs(hideBin(process.argv))
    .options({
        j: {
            alias: 'job',
            default: defaultTodayDashedPrefix,
            describe: 'Job id. Defaults to today\'s date.',
            type: 'string'
        }
    })
    .example(`$0 -- --job ${defaultTodayDashedPrefix}`, 'process the data harvested today')
    .help()
    .parseSync()

const job = argv.job
const baseDir = join(dirname(fileURLToPath(import.meta.url)), 'data')
const processedFilePath = join(baseDir, `${job}_processed.json`)
const unfilteredFilePath = join(baseDir, `${job}_unfiltered.json`)
// const browsingContextsPath = join(baseDir, `${job}_browsing-contexts.json`)
const harvestedDataPath = join(baseDir, `${job}_harvested.json`)
const reportTypesPath = join(baseDir, `${job}_reports-types.json`)

// const browsingContexts = JSON.parse(await readFile(browsingContextsPath))
const harvestedData = JSON.parse(await readFile(harvestedDataPath, 'utf-8'))

const noisyErrors = new Set()
const silentReports = new Map()
const httpStatuses = new Map()
const reportProperties = new Set()
const reportTypes = new Map()

const _n = new Intl.NumberFormat('fr-CA')

/**
 * @param {number} n
 */
function n(n) {
    return _n.format(n)
}

/**
 * @param {Array<import('@corvee/harvester').RecordType>} records
 */
async function doProcess(records) {

    records.forEach(record => {

        if (!httpStatuses.has(record.httpStatusCode)) {
            httpStatuses.set(record.httpStatusCode, 0)
        }

        let count = httpStatuses.get(record.httpStatusCode)
        count++
        httpStatuses.set(record.httpStatusCode, count)

        if (record.reports) {
            record.reports.forEach(report => {
                if (!silentReports.has(report.code)) {
                    silentReports.set(report.code, 0)
                }
                var count = silentReports.get(report.code)
                count++
                silentReports.set(report.code, count)
            })
        }
    })

    const processor = new CorveeProcessor({
        filters: [
            // devExcludeUrlsPlugin,
            ...filters,
            // tmpPlugin
        ],
        messages
    })

    processor.on('http-30x-root-to-path-permanent-redirect', function (record) {
        // console.log(inspect(record))
    })

    const excluded301Redirections = new Map()

    processor.on('filtered', function (record, filter) {
        if ((record?.httpStatusCode === 301 || record?.httpStatusCode === 308) && filter.exclude) {
            if (!excluded301Redirections.has(filter.code)) {
                excluded301Redirections.set(filter.code, 0)
            }

            excluded301Redirections.set(filter.code, excluded301Redirections.get(filter.code) + 1)

            // if (!['external-ignore-urls', 'udem-http-30x-calendrier', 'http-30x-circular-redirection', 'http-30x-slash', 'http-30x-root-to-path-permanent-redirect'].includes(filter.code)) {
            //     console.log('=== filtered ===')
            //     console.log(inspect(filter))
            //     console.log(inspect(record))
            //     process.exit()
            // }
        }
    })

    processor.on('filtered', (record, filter) => {
        noisyErrors.add(filter.code)
    })


    processor.on('filtered', record => {
        record.reports?.forEach(report => {
            if (!reportTypes.has(report.code)) {
                reportTypes.set(report.code, new Set())
            }

            reportTypes.get(report.code).add(record.url)
        })
    })

    console.log('Starting processor...')

    let result = await processor.process(records)

    // console.log('Adding browsing contexts...')

    // result.records = addContexts(result.records, browsingContexts)

    console.log('Adding sections...')

    addSections(result)

    result.records.forEach(record => record.job = job)

    result.records.forEach(record => {
        Object.keys(record).forEach(prop => reportProperties.add(prop))
    })

    result.records = result.records.filter(record => {
        return record.reports && record.reports.length > 0
    })

    silentReports.forEach((value, silentErrorCode) => {
        if (noisyErrors.has(silentErrorCode)) {
            silentReports.delete(silentErrorCode)
        }
    })

    const timing = Date.now() - start

    const perFilterData = result.perFilter
        .map(filterData => {
            filterData['has message'] = result.filtersWithoutMessages.includes(filterData.code) ? colors.red('-') : colors.green('✓')

            return filterData
        })
        .sort((a, b) => {
            const codeA = a.code.toUpperCase() // ignore upper and lowercase
            const codeB = b.code.toUpperCase() // ignore upper and lowercase
            if (codeA < codeB) {
                return -1
            }
            if (codeA > codeB) {
                return 1
            }
            return 0
        })
        .map(filter => {
            const values = Object.values(filter).map((value, i) => {

                switch (i) {
                    case 0:
                        return filter.excluded ? colors.gray(value) : value
                    case 1:
                        return n(value)
                    case 3:
                        return value === Infinity ? '' : `${value}`
                    case 5:
                        return value ? colors.green('✓') : ''
                    default:
                        return `${value}`
                }
            })
            return values
        })

    const perFilterTable = table([Object.keys(result.perFilter[0]), ...perFilterData], {
        border: getBorderCharacters('norc'),
        columns: {
            1: {
                alignment: 'right'
            },
            2: {
                alignment: 'center'
            },
            3: {
                alignment: 'center'
            },
            4: {
                alignment: 'center'
            },
            5: {
                alignment: 'center'
            },
            6: {
                alignment: 'center'
            }
        }
    })

    console.log(`Plugins stats:\n${perFilterTable}`)

    console.debug(`Processing done in ${timing / 1000}sec.`)
    console.log(`${n(result.nbIn)} items in.`)
    console.log(`${n(result.filtered)} items filtered.`)
    console.log(`${n(result.unfilteredRecords.length)} items unfiltered.`)
    console.log(`${n(result.nbOut)} items out.`)

    // console.log(`Records properties: ${[...reportProperties.values()].sort().join(', ')}`)
    console.log(`Filters that triggered an exclusion on a record that has a http status code of 301: ${inspect([...excluded301Redirections.entries()])}`)

    await writeFile(processedFilePath, JSON.stringify(result.records, null, 2))
    await writeFile(unfilteredFilePath, JSON.stringify(result.unfilteredRecords, null, 2))

    /**
     * @type {Partial<{string: Array<string>}>}
     */
    const reportTypesObj = {}
    const sortedReportTypesKeys = [...reportTypes.keys()].sort()
    sortedReportTypesKeys.forEach(key => {
        reportTypesObj[key] = [...reportTypes.get(key).values()].sort()
    })
    await writeFile(reportTypesPath, JSON.stringify(reportTypesObj, null, 2))

    result.records = result.records
        .map(record => {
            record.reports = record.reports.filter(report => report.level !== 'info')
            return record
        })
        .filter(record => record.reports.length > 0)

    console.log(colors.bold(`Found ${colors.green(n(result.records.length))} records with problems.`))

    await toSql({
        data: result.records,
        dir: baseDir,
        job
    })

    const sortedSilentErrors = [...silentReports.entries()]
        .sort((a, b) => {
            if (a[1] < b[1]) { return -1 }
            if (a[1] > b[1]) { return 1 }
            return 0
        })
        .reverse()
        .map(item => [item[0], n(item[1])])
    sortedSilentErrors.unshift(['Code d\'erreur', ' '])

    let totalHttpStatuses = 0
    let totalErrorsByStatusCode = 0

    const sortedHttpStatuses = [...httpStatuses.entries()]
        .sort((a, b) => {
            if (a[0] < b[0]) { return -1 }
            if (a[0] > b[0]) { return 1 }
            return 0
        })
        .map(item => {
            const status = item[0]
            const counts = item[1]

            totalHttpStatuses += counts

            switch (true) {
                case status === null:
                    totalErrorsByStatusCode += counts
                    break
                case status < 300:
                case status === 302:
                case status === 307:
                    break

                default:
                    totalErrorsByStatusCode += counts
            }

            return [`${item[0]}`, n(item[1])]
        })

    sortedHttpStatuses.unshift(['Code HTTP', ' '])
    sortedHttpStatuses.push(['Total reports', n(totalErrorsByStatusCode)])
    sortedHttpStatuses.push(['Total', n(totalHttpStatuses)])

    const tableConfig = {
        border: getBorderCharacters('norc'),
        columns: {
            1: {
                alignment: 'right'
            }
        }
    }

    console.log(`Found ${n(silentReports.size)} silent report types (reports whose filter never matched a record):\n${table(sortedSilentErrors, tableConfig)}`)

    console.log(`Found http status codes:\n${table(sortedHttpStatuses, tableConfig)}`)

    console.debug(`Results saved in ${processedFilePath}`)
};

try {
    await doProcess(harvestedData)
    process.exit()
} catch (error) {
    console.error(error)
    process.exit()
}