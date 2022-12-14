import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeUrl } from 'corvee-core'

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
        /^https:\/\/unequestion\.bib\.umontreal\.ca\//i,
        /^https:\/\/www\.bib\.umontreal\.ca\/ideale/i,
        /^https:\/\/www\.bib\.umontreal\.ca\/publications/i,

        // Applications des Bibliothèques
        /^http:\/\/geoindex\.bib\.umontreal\.ca/i,
        'testproxy.umontreal.ca',
        'http://expo.bib.umontreal.ca',
        'http://geos.bib.umontreal.ca',
        // 'https://umontreal.on.worldcat.org',
        /^https:\/\/[^\/]+\.worldcat\.org\//i,
        // /^https?:\/\/bib\.umontreal\.ca\/(.+)\?tab=([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])($|#)/i, // ?tab=0 à ?tab=9999

        // Liste AZ
        'https://libguides.bib.umontreal.ca/az.php',
        /^https:\/\/libguides\.bib\.umontreal\.ca\/[A-Za-z_]+/i,
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
        'https://www.canlii.org/', // Affiche une page de captcha avec le status 429 (Too Many Requests)

        // Autres
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
    maxConcurrency: 4,
    maxRequestRetries: 3,
    // maxRequests: 10,
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
        'https://jupiter.bib.umontreal.ca/GIF',
        'http://mentor.bib.umontreal.ca',
        'http://opurl.bib.umontreal.ca',
        'https://papyrus.bib.umontreal.ca',
        /^https:\/\/libguides\.bib\.umontreal\.ca\/c\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/prf\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/sb\.php/,
        /^https:\/\/libguides\.bib\.umontreal\.ca\/srch\.php/,
        /^https:\/\/umontreal\.libapps\.com/,
        /^https:\/\/bib\.umontreal\.ca\/(?:.+)\/news\/\-\/\-\//, // Liens vers une nouvelle qui n'a pas d'URL
    ],
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
    // startUrl: 'https://bib.umontreal.ca/typo3conf/ext/udem_bib/Resources/Public/Images/logo-bib.svg',
    // startUrl: 'https://api.bib.umontreal.ca/guides/embed/729885?tab=5238527',
    // startUrl: 'https://www.cairn.info/', // DataDome
    // startUrl: 'http://www.canlii.org/fr/', // http-429
    // startUrl: 'https://bib.umontreal.ca/amenagement/architecture',
    // startUrl: 'https://playwright.dev/docs/api/class-response', // http-200
    // startUrl: 'https://secretariatgeneral.umontreal.ca/public/secretariatgeneral/documents/doc_officiels/reglements/recherche/rech60_13-politique-universite-de-montreal-propriete-intellectuelle.pdf', // http-200
    // startUrl: 'http://www.jpma.or.jp/english/', // http-301
    // startUrl: 'https://eudocs.lib.byu.edu/index.php/main_page', // http-30x-permanent-redirect-successful
    // startUrl: 'https://nouveau.eureka.cc/Search/AdvancedMobile', // redirect-to-login-page
    // startUrl: 'https://reseau.umontreal.ca/bib', // http-302
    // startUrl: 'http://www.facebook.com/Banquemondiale', // http-307-HSTS-redirect
    // startUrl: 'http://www.zotero.org/support/screencast_tutorials', // http-HSTS-redirect
    // startUrl: 'http://localhost/t.html', // redirected asset
    // startUrl: 'https://fnp-ppn.aadnc-aandc.gc.ca/fnp/Main/?lang=fra', // http-403
    // startUrl: 'http://awefdkiofkdjnxmsklwoidjmsmsdldoslld.coz', // http-404
    // startUrl: 'http://www.collectionscanada.gc.ca/thesescanada/', // http-404
    // startUrl: 'https://www.icj-cij.org/files/publications/bibliography-en.pdf', // http-404
    // startUrl: 'https://oer.avu.org/handle/123456789/89', // net-connection-refused
    // startUrl: 'https://ebm-tools.knowledgetranslation.net/', // NET::ERR_CERT_DATE_INVALID
    // startUrl: 'https://www.hivebench.com/', // net-empty-response (net-http)
    // startUrl: 'https://incites.help.clarivate.com/content/indicators-handbook/ih-about.htm', // net-invalid-response (net-http)
    // startUrl: 'http://mesh.inserm.fr/frenchmesh/search/index.jsp', // net-too-many-redirects (net-http)
    // startUrl: 'http://Ensembles de données du recensement', // url-invalid-url
    // startUrl: 'https://1findr.1science.com/home', // net-empty-response (net-http)
    // startUrl: 'http://www.worldcat.org/oclc/196570217', // http-503
    // startUrl: 'http://www.openthesis.org/', // http-504 Gateway Timeout
    // startUrl: 'http://www.cnbksy.cn/shlib_tsdc/en/do', // http-412
    // startUrl: 'http://www.legislation.gov.uk/ukpga/Geo5/22-23/4', // http-504
    // startUrl: 'http://www.baisserlesbarrieres.org/videos/BLB-film_1-Entreprises_et_stagiaires_BLB_%28Daniel%29-fra.mp4', // TimeoutError (config.requestHandlerTimeoutSecs)
    storageDir: join(dirname(fileURLToPath(import.meta.url)), '..', '.storage'),
    userDataDir: join(dirname(fileURLToPath(import.meta.url)), '..', '.userData'),
    useCache: true,
    // useChrome: true,
    waitInterval: 50,
};