import fs from 'fs'
import { join } from 'path'
import yargs from 'yargs'
import { table, getBorderCharacters } from 'table'
import colors from 'colors/safe'
import { CorveeProcessor } from '../corvee/packages/processor'
import { getFinalStatus } from '../corvee/packages/harvester/lib'
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
const harvestedFilePath = join(baseDir, `${job}_harvested.json`)
const processedFilePath = join(baseDir, `${job}_processed.json`);
const unfilteredFilePath = join(baseDir, `${job}_unfiltered.json`);
const excludedFilePath = join(baseDir, `${job}_excluded.json`);
const browsingContextsPath = join(baseDir, `${job}_browsing-contexts.json`)

const browsingContexts = require(browsingContextsPath)

const silentErrors = new Set()
const harvestedRecords = require(harvestedFilePath)

async function doProcess(records) {

    harvestedRecords.forEach(record => {
        if (record.reports.length) {
            record.reports.forEach(report => {
                silentErrors.add(report.code)
            })
        }
    })

    records.forEach(r => {
        r.httpStatusCode = getFinalStatus(r);

        if (typeof r.browsingContextStack === 'undefined') {
            r.browsingContextStack = [];
            if (r.parent === 'https://guides.bib.umontreal.ca/embed/guides/25-Droit-d-auteur?tab=129') {
                r.parent = 'https://guides.bib.umontreal.ca/embed/guides/25?tab=129'
                r.browsingContextStack.push(['https://bib.umontreal.ca/gerer-diffuser/droit-auteur?tab=129'])
            }

            if (r.parent === 'https://guides.bib.umontreal.ca/embed/guides/25-Droit-d-auteur?tab=130') {
                r.parent = 'https://guides.bib.umontreal.ca/embed/guides/25?tab=130'
                r.browsingContextStack.push(['https://bib.umontreal.ca/gerer-diffuser/droit-auteur?tab=130'])
            }
        }
    });

    // const tmpPlugin = {
    //     code: 'tmp-plugin',
    //     test: (report) => {
    //         if ('responseChain' in report) {
    //             report.responseChain = report.responseChain.filter(r => {
    //                 if (r.url.startsWith('https://platform.twitter.com') ||
    //                     r.url.startsWith('https://syndication.twitter.com') ||
    //                     r.url.startsWith('https://s7.addthis.com') ||
    //                     r.url.startsWith('http://www.facebook.com/plugins') ||
    //                     r.url.startsWith('https://www.facebook.com/plugins') ||
    //                     r.url.startsWith('https://staticxx.facebook.com') ||
    //                     r.url.startsWith('https://www.bib.umontreal.ca/une-question') ||
    //                     r.url.startsWith('https://www.questionpoint.org/crs/qwidgetV4')) {
    //                     return false;
    //                 }
    //                 return true;
    //             })
    //         }

    //         if ('reports' in report && report.reports.some(r => r.code === 'cv-timeout-error')) {
    //             return true;
    //         }
    //     },
    //     exclude: true
    // }

    const processor = new CorveeProcessor({
        filters: [
            // devExcludeUrlsPlugin,
            ...filters,
            // tmpPlugin
        ],
        messages
    });

    // processor.on('filtered', function (record, filter) {
    //     if (record.id === 121998) {
    //         console.log(inspect(filter))
    //         console.log(inspect(record))
    //     }
    // })

    console.log('Starting processor...')

    let result = await processor.process(records);

    console.log('Adding browsing contexts...')

    result.records = addContexts(result.records, browsingContexts)

    result.records = result.records.filter(record => {
        return record.reports.length > 0;
    })

    const timing = Date.now() - start;

    const perFilterData = result.perFilter
        .map(filterData => {
            filterData['has message'] = result.filtersWithoutMessages.includes(filterData.code) ? colors.red('x') : '✓';

            return filterData;
        })
        .sort((a, b) => {
            var codeA = a.code.toUpperCase(); // ignore upper and lowercase
            var codeB = b.code.toUpperCase(); // ignore upper and lowercase
            if (codeA < codeB) {
                return -1;
            }
            if (codeA > codeB) {
                return 1;
            }
            return 0;
        }).map(f => {
            let values = Object.values(f).map((value, i) => {

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
    console.log(`${result.excludedCount} items excluded.`);
    console.log(`${result.nbOut} items out.`);

    fs.writeFileSync(processedFilePath, JSON.stringify(result.records, null, 2))
    fs.writeFileSync(unfilteredFilePath, JSON.stringify(result.unfilteredRecords, null, 2))
    fs.writeFileSync(excludedFilePath, JSON.stringify(result.excluded, null, 2))

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

    // await toJsonl({
    //     data: result.records,
    //     dir: baseDir,
    //     job
    // })

    console.log('Found %s silent report types: ', silentErrors.size, [...silentErrors.values()].sort())

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