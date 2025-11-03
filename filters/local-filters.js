import * as config from '../config/index.js'

// local plugins
import bibAtrium from './local/bib-atrium.js'
import bibBadAdresseSimplifiee from './local/bib-bad-adresses-simplifiees.js'
import bibHttpsUpgrade from './local/bib-https-upgrade.js'
import bibCommunicationsLienManquant from './local/bib-communications-lien-manquant.js'
import bibExamensAnneesAnterieures from './local/bib-examens-annees-anterieures.js'
import bibGif from './local/bib-gif.js'
import bibHttp30xRedirectionTypo3 from './local/bib-http-30x-redirection-typo3.js'
import bibLienBeTypo3 from './local/bib-lien-be-typo3.js'
import bibLienDeveloppementWebmestre from './local/bib-lien-developpement-webmestre.js'
import bibLienGuidesBibUmontrealCa from './local/bib-lien-guides-bib-umontreal-ca.js'
import bibLienGuidesWithOldTab from './local/bib-lien-guides-with-old-tab.js'
import bibLienLibguidesAdmin from './local/bib-lien-libguides-admin.js'
import bibLienLibguides from './local/bib-lien-libguides.js'
import bibLienTypo3Interne from './local/bib-lien-typo3-interne.js'
import bibLienGuideEmbed from './local/bib-liens-guide-embed.js'
import bibListeAZ from './local/bib-liste-az.js'
import bibMaestro from './local/bib-Maestro.js'
import bibPermalienBibUmontrealCa from './local/bib-permalien-bib-umontreal-ca.js'

import externalIgnoreUrls from './local/external-ignore-urls.js'
import microsoft from './local/microsoft-forward-link.js'
import publicAuthServices from './local/public-auth-services.js'

import sofiaRedirectionLinker2 from './local/sofia-redirection-linker2.js'
import sofiaWorldcatReponse503 from './local/sofia-worldcat-reponse-503.js'
import studiumLogin from './local/studium-login.js'
import udemHttp30xCalendrier from './local/udem-http-30x-calendrier.js'

import pupTimeoutRedirect from './local/pup-timeout-redirect.js'

import messages from './local/messages.js'

export const localMessages = messages

export const localFilters = [
    {
        ...bibAtrium,
        priority: 1
    },
    {
        ...bibBadAdresseSimplifiee({
            urls: config.adressesSimplifiees
        }),
        priority: 1
    },
    bibCommunicationsLienManquant,
    bibExamensAnneesAnterieures,
    bibGif,
    {
        ...bibHttp30xRedirectionTypo3,
        exclude: true
    },
    bibLienGuidesBibUmontrealCa,
    bibLienBeTypo3,
    bibLienDeveloppementWebmestre,
    bibLienGuidesWithOldTab,
    bibLienLibguidesAdmin,
    bibLienLibguides,
    bibLienTypo3Interne,
    bibLienGuideEmbed,
    {
        ...bibListeAZ,
        priority: 1
    },
    bibMaestro,
    {
        ...bibHttpsUpgrade,
        // exclude: true
    },
    bibPermalienBibUmontrealCa,
    {
        ...externalIgnoreUrls,
        exclude: true
    },
    {
        ...microsoft,
        exclude: true
    },
    {
        ...publicAuthServices,
        exclude: true
    },
    sofiaRedirectionLinker2,
    sofiaWorldcatReponse503,
    studiumLogin,
    udemHttp30xCalendrier,
    pupTimeoutRedirect,
]