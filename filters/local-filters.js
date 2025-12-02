import * as config from '../config/index.js'

// local plugins
import fixInternLink from './local/_fix-intern-link.js'
import bibAtrium from './local/bib-atrium.js'
import bibBadAdresseSimplifiee from './local/bib-bad-adresses-simplifiees.js'
import bibHttpsUpgrade from './local/bib-https-upgrade.js'
import bibCommunicationsLienManquant from './local/bib-communications-lien-manquant.js'
import bibExamensAnneesAnterieures from './local/bib-examens-annees-anterieures.js'
import bibGif from './local/bib-gif.js'
import bibLienDeveloppementWebmestre from './local/bib-lien-developpement-webmestre.js'
import bibLienLibguidesAdmin from './local/bib-lien-libguides-admin.js'
import bibListeAZ from './local/bib-liste-az.js'
import bibMaestro from './local/bib-Maestro.js'
import bibPermalienBibUmontrealCa from './local/bib-permalien-bib-umontreal-ca.js'
import boiteOutilsCPhpLinks from './local/boite-outils-c.php-links.js'
import boiteOutilsWelcomeRedirect from './local/boite-outils-welcome-redirect.js'

import doiOrg from './local/doi-org.js'
import externalIgnoreUrls from './local/external-ignore-urls.js'
import hdlHandleNet from './local/hdl-handle-net.js'
import microsoftForwardLink from './local/microsoft-forward-link.js'
import microsoftOutlinkSafelinkProtection from './local/microsoft-outlink-safelink-protection.js'
import publicAuthServices from './local/public-auth-services.js'

import sofiaRedirectionLinker2 from './local/sofia-redirection-linker2.js'
import sofiaWorldcatReponse503 from './local/sofia-worldcat-reponse-503.js'
import studiumLogin from './local/studium-login.js'
import udemHttp30xCalendrier from './local/udem-http-30x-calendrier.js'

import pupTimeoutRedirect from './local/pup-timeout-redirect.js'

import messages from './local/messages.js'

export const localMessages = messages

export const localFilters = [
    fixInternLink,
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
    bibLienDeveloppementWebmestre,
    bibLienLibguidesAdmin,
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
    boiteOutilsCPhpLinks,
    boiteOutilsWelcomeRedirect,
    {
        ...externalIgnoreUrls,
        exclude: true
    },
    {
        ...microsoftForwardLink,
        exclude: true
    },
    microsoftOutlinkSafelinkProtection,
    {
        ...publicAuthServices,
        exclude: true
    },
    sofiaRedirectionLinker2,
    sofiaWorldcatReponse503,
    studiumLogin,
    udemHttp30xCalendrier,
    pupTimeoutRedirect,
    hdlHandleNet,
    doiOrg,
]