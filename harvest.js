import readline from 'readline'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { console, inspect } from '@corvee/core'
import { Harvester } from '@corvee/harvester'
import { fetchGuides } from './lib/fetch-guides.js'
import { saveBrowsingContexts, saveReportCodes, saveRecords, saveSystemInfo } from './utils/index.js'
import pageSnippetPlugin from './plugins/page-snippet.js'

import { harvesterConfig } from './config/index.js'
import { savePageSnippets } from './utils/save-page-snippets.js'
import { linkParser } from './config/linkParser.js'

const today = new Date()
const year = today.getFullYear()
const month = `${today.getMonth() + 1}`.padStart(2, '0')
const day = `${today.getDate()}`.padStart(2, '0')

const defaultJob = `${year}-${month}-${day}`

const argv = yargs(hideBin(process.argv))
    .options({
        job: {
            alias: 'j',
            default: defaultJob,
            describe: `Job id. Defaults to today\'s date: ${defaultJob}`,
            type: 'string'
        },
        resume: {
            alias: 'r',
            default: false,
            type: 'boolean',
            describe: 'Resumes a previously stoped job. Requires --job options.',
            implies: 'j'
        }
    })
    .help()
    .parseSync()

const job = argv.job

let internLinks = new Set()
let externLinks = new Set()

async function harvest() {

    const guidesParams = new Set()

    // (await fetchGuides()).forEach(guide => guidesParams.add(guide.aliasUrl.split('?tab=')[1]))

    readline.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'p') {
            if (harvester.isPaused) {
                harvester.resume()
            } else {
                harvester.pause()
            }
        }

        if (key.ctrl && key.name === 'c') {
            process.exit()
        }
    })

    console.log('Using job ' + job)

    const harvester = new Harvester(harvesterConfig)

    /**
     * @type {Array<object>}
     */
    // const links = await fetchGuides()
    const links = []

    harvester.addPlugins(pageSnippetPlugin)

    harvester.setLinkParser(linkParser)

    await harvester.addUrl(links)

    harvester.on('request', function onRequest(request) {
        console.info(`[${request.retryCount}] Request url: ${request.url}`)

        if (request.userData.extern) {
            externLinks.add(request.url)
        } else {
            internLinks.add(request.url)
        }
    })

    harvester.on('add-link', function onAddLink(link) {
        try {
            const url = new URL(link.url)
            if (url.hostname === 'bib.umontreal.ca' && url.searchParams.has('tab') && guidesParams.has(url.searchParams.get('tab'))) {
                url.searchParams.delete('tab')
                link.url = url.href
                link.userData.url = url.href
            }
        } catch (e) {
            console.error(e)
        }

    })

    harvester.on('add-link', function onAddLink(link) {

        const analyticsQueryParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', '_gl']

        function stripAnalyticsQueryParams(url) {
            try {
                const u = new URL(url)
                u.searchParams.forEach((_, key) => {
                    if (analyticsQueryParams.includes(key)) {
                        u.searchParams.delete(key)
                    }
                })
                return u.href
            } catch (e) {
                return url
            }
        }

        ['finalUrl', 'parent', 'url'].forEach(prop => {
            if (link[prop]) {
                link[prop] = stripAnalyticsQueryParams(link[prop])
            }
        })

        savePageSnippets(harvester, job)

        saveRecords(harvester, job)

        saveBrowsingContexts(harvester, job)

        saveReportCodes(harvester, job)

        saveSystemInfo(harvester, job)

        // savePageTitles(harvester)

        const task = argv.resume ? 'resume' : 'run'

        console.info(`Running with config: ${inspect(harvester.config)}`)

        harvester.on('start', function onStart() {
            console.info(`Running with run options: ${inspect(harvester.runOptions)}`)
        })

        harvester.on('end', function onEnd() {
            console.info(`Found ${internLinks.size} intern pages.`)
            console.info(`Found ${externLinks.size} extern pages.`)
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

harvest()