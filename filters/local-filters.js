import * as config from '../config/index.js'

// local plugins
import { isBadAdresseSimplifiee } from './local/bib-adresses-simplifiees.js'
import bibHttpsUpgrade from './local/bib-https-upgrade.js'
import bibAncienAtrium from './local/bib-ancien-atrium.js'
import bibAtriumNonSecurise from './local/bib-atrium-non-securise.js'
import bibAtrium from './local/bib-atrium.js'
import bibCommunicationsLienManquant from './local/bib-communications-lien-manquant.js'
import bibExamensAnneesAnterieures from './local/bib-examens-annees-anterieures.js'
import bibGuidesBibUmontrealCa from './local/bib-guides-bib-umontreal-ca.js'
import bibHttp30xRedirectionTypo3 from './local/bib-http-30x-redirection-typo3.js'
import bibLienBeTypo3 from './local/bib-lien-be-typo3.js'
import bibLienDeveloppementEdimestre from './local/bib-lien-developpement-edimestre.js'
import bibLienDeveloppementWebmestre from './local/bib-lien-developpement-webmestre.js'
import bibLienGuidesWithOldTab from './local/bib-lien-guides-with-old-tab.js'
import bibLienLibguides from './local/bib-lien-libguides.js'
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

export const localMessages = messages;

export const localFilters = [
    {
        ...isBadAdresseSimplifiee({
            urls: config.adressesSimplifiees
        }),
        priority: 1
    },
    {
        ...bibAncienAtrium,
        priority: 1
    },
    bibCommunicationsLienManquant,
    bibAtriumNonSecurise,
    {
        ...bibAtrium,
        priority: 1
    },
    bibExamensAnneesAnterieures,
    {
        ...bibHttp30xRedirectionTypo3,
        exclude: true
    },
    bibGuidesBibUmontrealCa,
    bibLienBeTypo3,
    bibLienDeveloppementEdimestre,
    bibLienDeveloppementWebmestre,
    bibLienGuidesWithOldTab,
    bibLienLibguides,
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
        ...publicAuthServices,
        exclude: true
    },
    {
        ...externalIgnoreUrls,
        exclude: true
    },
    {
        ...microsoft,
        exclude: true
    },
    sofiaRedirectionLinker2,
    sofiaWorldcatReponse503,
    studiumLogin,
    udemHttp30xCalendrier,
    pupTimeoutRedirect,
]