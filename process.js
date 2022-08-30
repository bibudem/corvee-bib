import fs from 'fs'
import { join } from 'path'
import yargs from 'yargs'
import { table, getBorderCharacters } from 'table'
import colors from 'colors/safe'
import { CorveeProcessor } from '../corvee/packages/processor'
import { filters, messages } from './filters'
import { toSql } from './utils/to-sql'
import { addContexts } from './lib/add-contexts'
// import { toJsonl } from './utils/to-jsonl'
import { console, inspect } from '../corvee/packages/core'

const start = Date.now();
const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, '0');
const day = `${today.getDate()}`.padStart(2, '0');

const defaultTodayDashedPrefix = `${year}-${month}-${day}`;

const argv = yargs
    .options({
        j: {
            alias: 'job',
            default: defaultTodayDashedPrefix,
            describe: 'Job id. Defaults to today\'s date.',
            type: 'string'
        }
    })
    .help()
    .argv;

const job = argv.job;
const baseDir = join(__dirname, 'data');
const processedFilePath = join(baseDir, `${job}_processed.json`);
const unfilteredFilePath = join(baseDir, `${job}_unfiltered.json`);
const browsingContextsPath = join(baseDir, `${job}_browsing-contexts.json`)

const browsingContexts = require(browsingContextsPath)

const noisyErrors = new Set()
const silentErrors = new Map()
const httpStatuses = new Map()

async function doProcess(records) {

    records.forEach(record => {

        if (!httpStatuses.has(record.httpStatusCode)) {
            httpStatuses.set(record.httpStatusCode, 0)
        }

        let count = httpStatuses.get(record.httpStatusCode)
        count++
        httpStatuses.set(record.httpStatusCode, count)

        if (record.reports.length) {
            record.reports.forEach(report => {
                if (!silentErrors.has(report.code)) {
                    silentErrors.set(report.code, 0)
                }
                var count = silentErrors.get(report.code)
                count++
                silentErrors.set(report.code, count)
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

    // processor.on('unfiltered', function (record) {
    //     if (record.id === 106834) {
    //         console.log(inspect(record))
    //     }
    // })

    processor.on('filtered', (record, filter) => {
        noisyErrors.add(filter.code)
    })

    console.log('Starting processor...')

    let result = await processor.process(records);

    console.log('Adding browsing contexts...')

    result.records = addContexts(result.records, browsingContexts)

    result.records = result.records.filter(record => {
        return record.reports.length > 0;
    })

    silentErrors.forEach((value, silentErrorCode) => {
        if (noisyErrors.has(silentErrorCode)) {
            silentErrors.delete(silentErrorCode)
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
        }).map(f => {
            const values = Object.values(f).map((value, i) => {

                switch (i) {
                    case 1:
                        return value === 0 ? colors.grey(value) : value;
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
    console.log(`${result.nbIn} items in.`);
    console.log(`${result.filtered} items filtered.`);
    console.log(`${result.unfilteredRecords.length} items unfiltered.`);
    console.log(`${result.nbOut} items out.`);

    fs.writeFileSync(processedFilePath, JSON.stringify(result.records, null, 2))
    fs.writeFileSync(unfilteredFilePath, JSON.stringify(result.unfilteredRecords, null, 2))

    result.records = result.records
        .map(record => {
            record.reports = record.reports.filter(report => report.level !== 'info');
            return record;
        })
        .filter(record => record.reports.length > 0);

    console.log('Found %s records with problem.', result.records.length)

    await toSql({
        data: result.records,
        dir: baseDir,
        job
    })

    const sortedSilentErrors = [...silentErrors.entries()].sort((a, b) => {
        if (a[1] < b[1]) { return -1; }
        if (a[1] > b[1]) { return 1; }
        return 0;
    }).reverse()

    const sortedHttpStatuses = [...httpStatuses.entries()].sort((a, b) => {
        if (a[0] < b[0]) { return -1; }
        if (a[0] > b[0]) { return 1; }
        return 0;
    })

    console.log(`Found ${silentErrors.size} silent report types: ${inspect(sortedSilentErrors)}`)

    console.log(`Found http status codes: ${inspect(sortedHttpStatuses)}`)

    console.debug(`Results saved in ${processedFilePath}`)
};

import(join(baseDir, `${job}_harvested.json`))
    .then(records => records.default)
    .then(async records => {
        await doProcess(records);
    })
    .catch(e => {
        console.error(e);
        process.exit();
    });