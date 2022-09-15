import readline from 'readline'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Harvester } from '../corvee/packages/harvester/index.js'
import { fetchGuides } from './lib/fetch-guides.js'
import { saveBrowsingContexts, saveErrorCodes, saveRecords } from './utils/index.js'
import { console, inspect } from '../corvee/packages/core/index.js'

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

    // const links = await fetchGuides()
    const links = []

    harvester.setLinkParser(function linkParser() {
        return Array
            .from(document.querySelectorAll('a[href]'))
            // Exclude those inside a rss module
            .filter(link => !link.parentNode.closest('.s-lg-rss-list-item'))
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

    saveRecords(harvester, job, (record) => {
        //return record.extern && record.url && !record.url.startsWith('mailto:');
        return true;
    })

    saveBrowsingContexts(harvester, job);

    saveErrorCodes(harvester, job);

    // savePageTitles(harvester)

    const task = argv.resume ? 'resume' : 'run';

    try {
        console.log(`${task === 'resume' ? 'Resuming' : 'Running'} harvesting.`)
        await harvester[task]()
    } catch (e) {
        console.error(e)
        process.exit()
    }
}

harvest();