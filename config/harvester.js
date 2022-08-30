import { join } from 'path'
import { normalizeUrl } from '../../corvee/packages/core/lib';

import { adressesSimplifiees } from './adresses-simplifiees'

export const harvesterConfig = {
    checkExtern: true,
    fetchLinksOnce: true,
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
        // /^https:\/\/api\.bib\.umontreal\.ca/,
        /^http:\/\/geoindex\.bib\.umontreal\.ca/i,
        'testproxy.umontreal.ca',
        'http://expo.bib.umontreal.ca',
        'https://umontreal.on.worldcat.org',

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
    internLinks: [
        /https?:\/\/[^\/]*bib\.umontreal\.ca(:\d+)?(\/.*)?/,
        /https?:\/\/atrium\.umontreal\.ca(\/.*)?/,
        /https:\/\/umontreal\.on\.worldcat\.org(\/.*)?/,
        /https:\/\/umontreal\.account\.worldcat\.org(\/.*)?/,
        /https:\/\/87128\.account\.worldcat\.org(\/.*)?/
    ],
    linkParserDelay: false,
    logLevel: 'verbose',
    maxConcurrency: 10,
    maxRequestRetries: 3,
    // maxRequests: 400000,
    // maxRequests: 1,
    navigationOnly: true,
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
        /^https:\/\/libguides\.bib\.umontreal\.ca\/c\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/prf\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/sb\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/srch\.php/,
        /^https:\/\/umontreal\.libapps\.com/
    ],
    notifyLogLevel: 'info',
    pageWaitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    requestTimeout: 30000,
    schemes: ['mailto'],
    startUrl: 'https://bib.umontreal.ca/',
    // startUrl: 'http://fr.espacenet.com/', // empty response
    // startUrl: 'https://secretariatgeneral.umontreal.ca/public/secretariatgeneral/documents/doc_officiels/reglements/recherche/rech60_13-politique-universite-de-montreal-propriete-intellectuelle.pdf',
    storageDir: join(__dirname, '..', '.storage'),
    normalizeUrlFunction: (url) => {

        url = normalizeUrl(url)

        if (url.startsWith('https://libguides.bib.umontreal.ca/az.php?')) {
            return url.split('?')[0]
        }

        return url
    },
    userDataDir: join(__dirname, '..', '.userData'),
    useRandomUserAgent: true,
    useCache: true,
    // useChrome: true,
    waitInterval: 50,
};