import path from 'path'
import {
    getRandomUserAgent
} from '../../Corvee-2/packages/core/lib'

import {
    adressesSimplifiees
} from './adresses-simplifiees'

export const harvesterConfig = {
    apifyLocalStorageDir: path.join(__dirname, '../.storage'),
    puppeteerCacheDir: path.join(__dirname, '../.cache'),
    startUrl: 'https://bib.umontreal.ca/',
    internLinks: [
        /https?:\/\/[^\/]*bib\.umontreal\.ca(:\d+)?(\/.*)?/,
        /https?:\/\/atrium\.umontreal\.ca(\/.*)?/,
        /https:\/\/umontreal\.on\.worldcat\.org(\/.*)?/,
        /https:\/\/umontreal\.account\.worldcat\.org(\/.*)?/,
        /https:\/\/87128\.account\.worldcat\.org(\/.*)?/
    ],
    fetchLinksOnce: true,
    checkExtern: true,
    pageWaitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    navigationOnly: true,
    userAgent: getRandomUserAgent(),
    useCache: true,
    maxConcurrency: 50,
    // maxRequests: 400000,
    // maxRequests: 1,
    maxRequestRetries: 3,
    waitInterval: 150,
    linkParserDelay: false,

    // URLs matching the given regular expressions / strings will be ignored and not checked.
    // /^https:\/\/bib\.umontreal\.ca\/[^#?]/, 
    ignore: [
        ...adressesSimplifiees,
        // 
        /^https:\/\/bib\.umontreal\.ca\/activites/i,
        /^https:\/\/bib\.umontreal\.ca\/communications\/nouvelles/i,
        'https://www.bib.umontreal.ca/une-question',
        /^https:\/\/www\.bib\.umontreal\.ca\/ideale/i,
        /^https:\/\/www\.bib\.umontreal\.ca\/publications/i,

        // Applications des Bibliothèques
        /^https:\/\/api\.bib\.umontreal\.ca/,
        /^http:\/\/geoindex\.bib\.umontreal\.ca/i,
        'testproxy.umontreal.ca',
        'http://expo.bib.umontreal.ca',
        'https://www.questionpoint.org',

        // Adresses UdeM connues
        /^https:\/\/www\.umontreal\.ca\/?$/i, // page d'accueil de l'UdeM
        /^https:\/\/identification\.umontreal\.ca/i,
        'nouvelles.umontreal.ca',
        'https://outlook.umontreal.ca',
        'https://monportail.umontreal.ca',
        'http://bottin.dgtic.umontreal.ca',
        /^http:\/\/jade\.daa\.umontreal\.ca/,
        /^https:\/\/plancampus\.umontreal\.ca\/?$/, // redirige vers https://plancampus.umontreal.ca/montreal/
        'http://donner.umontreal.ca/',

        // Widgets / médias sociaux
        /^https?:\/\/platform\.twitter\.com\/widgets/i,
        /^https?:\/\/www\.facebook\.com\/plugins/i,
        /^https?:\/\/connect\.facebook\.net/i,
        /^https?:\/\/www\.facebook\.com\/v\d/i,
        /^https?:\/\/platform\.linkedin\.com/i,
        /^https?:\/\/([^.\/]+\.)?addthis.com/i,
        /^https?:\/\/([^.\/]+\.)?sharethis.com/i,

        // Abonnements
        /^http:\/\/ovidsp\.ovid\.com/i,

        // Autres
        'www.canlii.org',
        'cairn.info',
        'advance.lexis.com',
        /^https:\/\/fusion\.google\.com/i,
        /^https:\/\/books\.google\.com/i,

        // Temporaire
        // 'https://atrium.umontreal.ca'
    ],

    // Check but do not recurse into URLs matching the given strings / regular expressions. 
    noFollow: [
        /^https:\/\/umontreal\.on\.worldcat\.org/,
        /^https:\/\/umontreal\.account\.worldcat\.org/,
        /^https:\/\/87128\.account\.worldcat\.org/,
        /^https?:\/\/bibres\.bib\.umontreal\.ca/,
        /^https:\/\/calendrier\.bib\.umontreal\.ca/,
        /^https?:\/\/calypso\.bib\.umontreal\.ca/,
        'https://jupiter.bib.umontreal.ca/GIF',
        'http://mentor.bib.umontreal.ca',
        'http://olympe.bib.umontreal.ca',
        'http://opurl.bib.umontreal.ca',
        'https://papyrus.bib.umontreal.ca',
        /^https?:\/\/pds\.bib\.umontreal\.ca/,
        /^https?:\/\/primo-test\.bib\.umontreal\.ca/,
    ],

    /**
     * Node.js URL class.
     * @external URL
     * @see {@link https://nodejs.org/api/url.html#url_class_url}
     */

    /** @member {(string|external:URL)} [proxy] - Url of a web proxy server (string or URL object) */
    // proxy: 'some-url',
    // proxy: 'http://localhost:8888'
};