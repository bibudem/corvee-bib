import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { table, getBorderCharacters } from 'table'
import colors from 'colors/safe.js'
import { CorveeProcessor } from '@corvee/processor'
import { filters, messages } from './filters/index.js'
import { toSql } from './utils/to-sql.js'
// import { addContexts } from './lib/add-contexts.js'
import { console, inspect } from '@corvee/core'

const start = Date.now();
const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, '0');
const day = `${today.getDate()}`.padStart(2, '0');

const defaultTodayDashedPrefix = `${year}-${month}-${day}`;

const argv = yargs(hideBin(process.argv))
    .options({
        j: {
            alias: 'job',
            default: defaultTodayDashedPrefix,
            describe: 'Job id. Defaults to today\'s date.',
            type: 'string'
        }
    })
    .help()
    .parseSync();

const job = argv.job;
const baseDir = join(dirname(fileURLToPath(import.meta.url)), 'data');
const processedFilePath = join(baseDir, `${job}_processed.json`);
const unfilteredFilePath = join(baseDir, `${job}_unfiltered.json`);
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
 * @param {Array<Record>} records
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
    });

    // processor.on('http-30x-permanent-redirect-failure', function (record) {
    //     console.log(inspect(record))
    // })

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

    let result = await processor.process(records);

    // console.log('Adding browsing contexts...')

    // result.records = addContexts(result.records, browsingContexts)

    result.records.forEach(record => {
        Object.keys(record).forEach(prop => reportProperties.add(prop))
    })

    result.records = result.records.filter(record => {
        return record.reports.length > 0;
    })

    silentReports.forEach((value, silentErrorCode) => {
        if (noisyErrors.has(silentErrorCode)) {
            silentReports.delete(silentErrorCode)
        }
    })

    const timing = Date.now() - start;

    const perFilterData = result.perFilter
        .map(filterData => {
            filterData['has message'] = result.filtersWithoutMessages.includes(filterData.code) ? colors.red('x') : colors.green('✓');

            return filterData;
        })
        .sort((a, b) => {
            const codeA = a.code.toUpperCase(); // ignore upper and lowercase
            const codeB = b.code.toUpperCase(); // ignore upper and lowercase
            if (codeA < codeB) {
                return -1;
            }
            if (codeA > codeB) {
                return 1;
            }
            return 0;
        })
        .map(f => {
            const values = Object.values(f).map((value, i) => {

                switch (i) {
                    case 1:
                        return value === 0 ? colors.grey(value) : n(value);
                    case 2:
                        return value ? colors.green('✓') : ''
                    default:
                        return value;
                }
            })
            return values;
        });

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
            }
        }
    });

    console.log(`Plugins stats:\n${perFilterTable}`);

    console.debug(`Processing done in ${timing / 1000}sec.`)
    console.log(`${n(result.nbIn)} items in.`);
    console.log(`${n(result.filtered)} items filtered.`);
    console.log(`${n(result.unfilteredRecords.length)} items unfiltered.`);
    console.log(`${n(result.nbOut)} items out.`);
    console.log(`Records properties: ${[...reportProperties.values()].sort().join(', ')}`)

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
            record.reports = record.reports.filter(report => report.level !== 'info');
            return record;
        })
        .filter(record => record.reports.length > 0);

    console.log(`Found ${n(result.records.length)} records with problem.`)

    await toSql({
        data: result.records,
        dir: baseDir,
        job
    })

    const sortedSilentErrors = [...silentReports.entries()]
        .sort((a, b) => {
            if (a[1] < b[1]) { return -1; }
            if (a[1] > b[1]) { return 1; }
            return 0;
        })
        .reverse()
        .map(item => [item[0], n(item[1])])
    sortedSilentErrors.unshift(['Code d\'erreur', ' '])

    const sortedHttpStatuses = [...httpStatuses.entries()]
        .sort((a, b) => {
            if (a[0] < b[0]) { return -1; }
            if (a[0] > b[0]) { return 1; }
            return 0;
        })
        .map(item => [`${item[0]}`, n(item[1])])
    sortedHttpStatuses.unshift(['Code HTTP', ' '])

    const tableConfig = {
        border: getBorderCharacters('norc'),
        columns: {
            1: {
                alignment: 'right'
            }
        }
    }

    console.log(`Found ${n(silentReports.size)} silent report types:\n${table(sortedSilentErrors, tableConfig)}`)

    console.log(`Found http status codes:\n${table(sortedHttpStatuses, tableConfig)}`)

    console.debug(`Results saved in ${processedFilePath}`)
};

try {
    await doProcess(harvestedData);
    process.exit()
} catch (error) {
    console.error(error);
    process.exit();
}