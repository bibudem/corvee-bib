import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeUrl } from '@corvee/core'

import { adressesSimplifiees } from './adresses-simplifiees.js'

export const harvesterConfig = {
    browser: 'chrome',
    checkExtern: true,
    fetchLinksOnce: true,
    getPerfData: false,

    // URLs matching the given regular expressions / strings will be ignored and not checked.
    ignore: [
        ...adressesSimplifiees,
        // 
        /^https:\/\/bib\.umontreal\.ca\/nouvelles/i,
        'https://www.bib.umontreal.ca/une-question',
        /^https:\/\/unequestion\.bib\.umontreal\.ca\//i,
        /^https:\/\/www\.bib\.umontreal\.ca\/publications/i,

        // Applications des Bibliothèques
        /^http:\/\/geoindex\.bib\.umontreal\.ca/i,
        'testproxy.umontreal.ca',
        'http://geos.bib.umontreal.ca',
        /^https:\/\/[^\/]+\.worldcat\.org\//i,

        //
        // LibGuides et cie.
        //

        'https://boite-outils.bib.umontreal.ca/srch.php',

        // Liste AZ
        /^https:\/\/umontreal\.libapps\.com\/libapps\/login\.php/i,

        // Adresses UdeM connues
        /^https:\/\/www\.umontreal\.ca\/?$/i, // page d'accueil de l'UdeM
        /^https:\/\/identification\.umontreal\.ca/i,
        'nouvelles.umontreal.ca',
        'https://outlook.umontreal.ca',
        'https://monportail.umontreal.ca',
        'http://bottin.dgtic.umontreal.ca',
        /^http:\/\/jade\.daa\.umontreal\.ca/,
        /^https:\/\/plancampus\.umontreal\.ca\/?$/, // redirige vers https://plancampus.umontreal.ca/montreal/
        'https://reseau.umontreal.ca/BIB', // Lien "Je donne" du bandeau UdeM

        // Widgets / médias sociaux
        /^https?:\/\/platform\.twitter\.com\/widgets/i,
        /^https?:\/\/www\.facebook\.com\/plugins/i,
        /^https?:\/\/connect\.facebook\.net/i,
        /^https?:\/\/www\.facebook\.com\/v\d/i,
        /^https?:\/\/platform\.linkedin\.com/i,
        /^https?:\/\/([^.\/]+\.)?addthis.com/i,
        /^https?:\/\/([^.\/]+\.)?sharethis.com/i,

        // Abonnements
        'https://www.canlii.org/', // Affiche une page de captcha avec le status 429 (Too Many Requests)

        // Autres
        /^https:\/\/fusion\.google\.com/i,
        /^https:\/\/books\.google\.com/i,
        /^https:\/\/documents\.un\.org\//i,
        /^https:\/\/news\.google\.com\//i, //

        // TEMP
        'https://kerko.bib.umontreal.ca',
        'https://bibliographies.bib.umontreal.ca',
    ],
    internLinks: [
        /^https?:\/\/[^\/]*bib\.umontreal\.ca(:\d+)?(\/.*)?/,
        /^https:\/\/umontreal\.on\.worldcat\.org(\/.*)?/,
        /^https:\/\/umontreal\.account\.worldcat\.org(\/.*)?/,
        // 'http://localhost[.*]'
    ],
    linkParserDelay: false,
    logLevel: 'verbose',
    maxConcurrency: 15,
    maxRequestRetries: 3,
    // maxRequestsPerCrawl: 50,
    navigationOnly: true,
    // navigationTimeoutSecs: 5,

    // Check but do not recurse into URLs matching the given strings / regular expressions. 
    noFollow: [
        /^https:\/\/umontreal\.on\.worldcat\.org/,
        /^https:\/\/umontreal\.account\.worldcat\.org/,
        /^https:\/\/87128\.account\.worldcat\.org/,
        /^https?:\/\/bibres\.bib\.umontreal\.ca/,
        /^https:\/\/calendrier\.bib\.umontreal\.ca/,
        /^https?:\/\/calypso\.bib\.umontreal\.ca/,
        'http://mentor.bib.umontreal.ca',
        'https://papyrus.bib.umontreal.ca',
        /^https:\/\/libguides\.bib\.umontreal\.ca\/c\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/prf\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/sb\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/srch\.php/,
        /^https:\/\/umontreal\.libapps\.com/,
        /^https:\/\/docs\.bib\.umontreal\.ca\//,
        /^https:\/\/rel\.bib\.umontreal\.ca\//,
        /^https:\/\/kerko\.bib\.umontreal\.ca\//,
        /^https:\/\/bibliographies\.bib\.umontreal\.ca\//,
    ],
    /**
     * Function to normalize URLs for the purpose of the web crawler.
     * By default, it returns the result of the normalizeUrl function.
     * If the URL starts with 'https://libguides.bib.umontreal.ca/az.php?', it returns the URL up to the first '?' character.
     * @param {string} url The URL to be normalized.
     * @return {string} The normalized URL.
     */
    normalizeUrlFunction: (url) => {

        url = normalizeUrl(url)

        if (url.startsWith('https://libguides.bib.umontreal.ca/az.php?')) {
            return url.split('?')[0]
        }

        return url
    },
    notifyLogLevel: 'info',
    pageWaitUntil: {
        intern: 'networkidle',
        extern: 'load'
    },
    // requestHandlerTimeoutSecs: 60,
    schemes: ['mailto'],
    startUrl: 'https://bib.umontreal.ca/',
    storageDir: join(dirname(fileURLToPath(import.meta.url)), '..', '.storage'),
    userDataDir: join(dirname(fileURLToPath(import.meta.url)), '..', '.userData'),
    useCache: true,
    // useChrome: true,
    waitInterval: 25,
}