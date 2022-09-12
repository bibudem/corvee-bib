import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeUrl } from '../../corvee/packages/core/lib/index.js';

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
        // /^https:\/\/bib\.umontreal\.ca\/[^#?]/, 
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
        'http://geos.bib.umontreal.ca',
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
        /^https:\/\/documents\.un\.org\//i,
    ],
    internLinks: [
        /https?:\/\/[^\/]*bib\.umontreal\.ca(:\d+)?(\/.*)?/,
        /https?:\/\/atrium\.umontreal\.ca(\/.*)?/,
        /https:\/\/umontreal\.on\.worldcat\.org(\/.*)?/,
        /https:\/\/umontreal\.account\.worldcat\.org(\/.*)?/,
        /https:\/\/87128\.account\.worldcat\.org(\/.*)?/,
        // 'http://localhost[.*]'
    ],
    linkParserDelay: false,
    logLevel: 'verbose',
    maxConcurrency: 10,
    maxRequestRetries: 3,
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
    pageWaitUntil: {
        intern: 'networkidle',
        extern: 'load'
    },
    requestTimeout: 30000,
    schemes: ['mailto'],
    // startUrl: 'https://bib.umontreal.ca/',
    // startUrl: 'http://www.collectionscanada.gc.ca/thesescanada/', // http-404
    startUrl: 'https://oer.avu.org/handle/123456789/89', // net-connection-refused
    // startUrl: 'https://nouveau.eureka.cc/Search/AdvancedMobile', // redirect-to-login-page
    // startUrl: 'https://reseau.umontreal.ca/bib', // redirect
    // startUrl: 'http://localhost/t.html', // redirected asset
    // startUrl: 'https://eudocs.lib.byu.edu/index.php/main_page', // http-30x-permanent-redirect-failure
    // startUrl: 'http://www.jpma.or.jp/english/', // 301 redirect
    // startUrl: 'http://fr.espacenet.com/', // empty response
    // startUrl: 'https://ambq.org/contenu_accueil.asp?categorie_code=302&chaine_recherche=&contenu_code=&date_spectacle=&ville_recherche=', // net-certificate
    // startUrl: 'https://www.hivebench.com/', // net-connection
    // startUrl: 'https://incites.help.clarivate.com/content/indicators-handbook/ih-about.htm', // net-http
    // startUrl: 'http://mesh.inserm.fr/frenchmesh/search/index.jsp', // net-http
    // startUrl: 'http://Ensembles de données du recensement', // url-invalid-url
    // startUrl: 'https://1findr.1science.com/home', // net-name-not-resolved
    // startUrl: 'http://www.openthesis.org/', // timeout
    // startUrl: 'https://www.icj-cij.org/files/publications/bibliography-en.pdf', // 404
    // startUrl: 'https://urfist.chartes.psl.eu/sites/default/files/ab/bouchard_urfistparis_identitenumerique_synthese_072020.pdf',
    // startUrl: 'https://secretariatgeneral.umontreal.ca/public/secretariatgeneral/documents/doc_officiels/reglements/recherche/rech60_13-politique-universite-de-montreal-propriete-intellectuelle.pdf',
    // startUrl: 'http://www.cnbksy.cn/shlib_tsdc/en/do', // http-412
    // startUrl: 'http://www.legislation.gov.uk/ukpga/Geo5/22-23/4', // http-504
    // storageDir: join(dirname(import.meta.url), '..', 'apify_storage'),
    storageDir: join(dirname(fileURLToPath(import.meta.url)), '..', '.storage'),
    normalizeUrlFunction: (url) => {

        url = normalizeUrl(url)

        if (url.startsWith('https://libguides.bib.umontreal.ca/az.php?')) {
            return url.split('?')[0]
        }

        return url
    },
    userDataDir: join(dirname(fileURLToPath(import.meta.url)), '..', '.userData'),
    useRandomUserAgent: true,
    useCache: true,
    // useChrome: true,
    waitInterval: 50,
};