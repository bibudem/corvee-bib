import readline from 'readline'
import Apify from 'apify';

import yargs from 'yargs'

import { Harvester } from '../corvee/packages/harvester/lib/harvester'

import {
    saveBrowsingContexts,
    saveErrorCodes,
    savePageTitles,
    saveRecords,
    saveInternLinks,
} from './utils'


import { console } from '../corvee/packages/core/lib';

import { harvesterConfig } from './config'

// const links = require('./config/links.json')
// const links = ['https://libguides.bib.umontreal.ca/az.php']
const links = []

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
            describe: `Job id. Defaults to today\'s date.`,
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

const jobId = argv.job;

const harvester = new Harvester(harvesterConfig);

harvester.setLinkParser(function linkParser() {
    return Array
        .from(document.querySelectorAll('a[href]'))
        // Exclude those inside a rss module
        .filter(link => !link.parentNode.closest('.module-rss-resource'))
        .map(link => ({
            url: link.href,
            text: link.tagName === 'IMG' ? link.getAttribute('alt') : link.innerText,
            urlData: link.getAttribute('href'),
            isNavigationRequest: true
        }))
})

harvester.addUrl(links);

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

saveRecords(harvester, jobId, (record) => {
    //return record.extern && record.url && !record.url.startsWith('mailto:');
    return true;
})

saveBrowsingContexts(harvester, jobId);

saveInternLinks(harvester, jobId);

saveErrorCodes(harvester, jobId);

// savePageTitles(harvester)

const task = argv.resume ? 'resume' : 'run';

try {
    console.log(`${task === 'resume' ? 'Resuming' : 'Running'} harvesting.`)
    Apify.main(harvester[task]())
} catch (e) {
    console.error(e)
    process.exit()
}