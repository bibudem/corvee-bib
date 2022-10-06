import readline from 'readline'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Harvester } from '@corvee/harvester'
import { fetchGuides } from './lib/fetch-guides.js'
import { saveBrowsingContexts, saveReportCodes, saveRecords, saveSystemInfo } from './utils/index.js'
import { console, inspect } from '@corvee/core'

import { harvesterConfig } from './config/index.js'

const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, '0');
const day = `${today.getDate()}`.padStart(2, '0');

const defaultJob = `${year}-${month}-${day}`;

const argv = yargs(hideBin(process.argv))
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

async function harvest() {

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'p') {
            if (harvester.isPaused) {
                harvester.resume();
            } else {
                harvester.pause();
            }
        }

        if (key.ctrl && key.name === 'c') {
            process.exit()
        }
    });

    console.log('Using job ' + job)

    const harvester = new Harvester(harvesterConfig)

    /**
     * @type {Array<HTMLAnchorElement>}
     */
    // const links = await fetchGuides()
    const links = []

    harvester.setLinkParser(function linkParser() {
        return Array
            .from(document.querySelectorAll('a[href]'))
            // Exclude those inside a rss module
            .filter(link => !(link.parentNode && link.parentNode instanceof HTMLAnchorElement && link.parentNode.closest('.s-lg-rss-list-item')))
            .map(link => ({
                url: link.href,
                text: link.tagName === 'IMG' ? link.getAttribute('alt') : link.innerText,
                urlData: link.getAttribute('href'),
                isNavigationRequest: true
            }))
    })

    await harvester.addUrl(links);

    harvester.on('request', function onRequest(request) {
        console.info(`[${request.retryCount}] Request url: ${request.url}`);
    })

    harvester.on('systemInfo', function onSystemInfo(data) {
        console.info(`[systemInfo] ${inspect(data)}`)
    })

    saveRecords(harvester, job, (record) => {
        //return record.extern && record.url && !record.url.startsWith('mailto:');
        return true;
    })

    saveBrowsingContexts(harvester, job);

    saveReportCodes(harvester, job);

    saveSystemInfo(harvester, job)

    // savePageTitles(harvester)

    const task = argv.resume ? 'resume' : 'run';

    console.info(`Running with config: ${inspect(harvester.config)}`);

    harvester.on('start', function onStart() {
        console.info(`Running with run options: ${inspect(harvester.runOptions)}`)
    })

    console.info(`autoscaledPool options: ${inspect(harvester.autoscaledPoolOptions)}`)
    console.info(`browserPool options: ${inspect(harvester.browserPoolOptions)}`)
    console.info(`launchContext options: ${inspect(harvester.launchContextOptions)}`)
    console.info(`playwrightCrawler options: ${inspect(harvester.playwrightCrawlerOptions)}`)

    console.log(`${task === 'resume' ? 'Resuming' : 'Running'} harvesting.`)

    try {
        await harvester[task]()
    } catch (e) {
        console.error(e)
        process.nextTick(function () {
            process.exit()
        })
    }
}

harvest();