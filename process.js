import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { table, getBorderCharacters } from 'table'
import colors from 'colors/safe'
import { CorveeProcessor } from '../corvee/packages/processor'
import { console } from '../corvee/packages/core'
import { plugins, messages } from './plugins'
import { toSql } from './utils/to-sql'
import { toJsonl } from './utils/to-jsonl'
import { getFinalStatus } from '../corvee/packages/core'

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

const jobId = argv.job;
const baseDir = path.join(__dirname, 'data');
const filePath = path.join(baseDir, `${jobId}_processed.json`);
const excludedStatsPath = path.join(baseDir, `${jobId}_excluded.json`);
const strictHttpsRedirectsPath = path.join(baseDir, `${jobId}_strict-https-redirects.json`);

async function doTest(records) {

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
            ...plugins,
            // tmpPlugin
        ],
        messages
    });

    const strictHttpsRedirects = new Map();

    processor.on('http-30x-https-upgrade', (report) => {

        strictHttpsRedirects.set(report.url, report.finalUrl)
    })

    // processor.on('filtered', function (record, filter) {
    //     if (record.id === 113970) {
    //         console.log(filter)
    //         console.log(record)
    //     }
    // })

    console.log('Starting processor...')

    let result = await processor.process(records);

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

    const timing = Date.now() - start;
    console.log(`Plugins stats:\n${perFilterTable}`);

    console.debug(`Processing done in ${timing / 1000}sec.`)
    console.log(`${result.nbIn} items in.`);
    console.log(`${result.filtered} items filtered.`);
    console.log(`${result.excludedCount} items excluded.`);
    console.log(`${result.nbOut} items out.`);

    result.records = result.records.filter(record => {
        return record.reports.length > 0;
    })

    // result.records.forEach(record => {
    //     if (record.parent.startsWith('https://libguides.bib.umontreal.ca/c.php')) {
    //         const parent = new URL(record.parent)
    //         const newParent = new URL('https://api.bib.umontreal.ca/guides/embed/' + parent.searchParams.get('g'))
    //         newParent.searchParams.set('tab', parent.searchParams.get('p'))
    //         record.parent = newParent.href;
    //     }
    // })

    fs.writeFileSync(filePath, JSON.stringify(result.records, null, 2))
    fs.writeFileSync(excludedStatsPath, JSON.stringify(result.excluded, null, 2))

    const sortedRedirects = Array.from(strictHttpsRedirects.entries()).sort((a, b) => {
        var nameA = a[0].toUpperCase(); // ignore upper and lowercase
        var nameB = b[0].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    })
    fs.writeFileSync(strictHttpsRedirectsPath, JSON.stringify(sortedRedirects, null, 2))


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
        jobId
    })

    await toJsonl({
        data: result.records,
        dir: baseDir,
        jobId
    })

    console.debug(`Results saved in ${filePath}`)
};

import(path.join(baseDir, `${jobId}_harvested.json`))
    .then(records => records.default)
    .then(async records => {

        await doTest(records);
    })
    .catch(e => {
        console.error(e);
        process.exit();
    });