import * as config from '../config'

// local plugins
import { isBadAdresseSimplifiee } from './local/bib-adresses-simplifiees'
import bibHttpsUpgrade from './local/bib-https-upgrade'
import bibAncienAtrium from './local/bib-ancien-atrium'
import bibAtriumNonSecurise from './local/bib-atrium-non-securise'
import bibAtrium from './local/bib-atrium'
import bibExamensAnneesAnterieures from './local/bib-examens-annees-anterieures'
import bibGuidesBibUmontrealCa from './local/bib-guides-bib-umontreal-ca'
import bibHttp30xRedirectionTypo3 from './local/bib-http-30x-redirection-typo3'
import bibLienBeTypo3 from './local/bib-lien-be-typo3'
import bibLienDeveloppementEdimestre from './local/bib-lien-developpement-edimestre'
import bibLienGuidesWithOldTab from './local/bib-lien-guides-with-old-tab'
import bibLienLibguides from './local/bib-lien-libguides'
import bibLienGuideEmbed from './local/bib-liens-guide-embed'
import bibListeAZ from './local/bib-liste-az'
import bibMaestro from './local/bib-Maestro'
import bibPermalienBibUmontrealCa from './local/bib-permalien-bib-umontreal-ca'
import bibPretReseau from './local/bib-pret-reseau'

import externalIgnoreUrls from './local/external-ignore-urls'
import microsoft from './local/microsoft-forward-link'
import publicAuthServices from './local/public-auth-services'

import sofiaRedirectionLinker2 from './local/sofia-redirection-linker2'
import studiumLogin from './local/studium-login'
import udemHttp30xCalendrier from './local/udem-http-30x-calendrier'

import messages from './local/messages'

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
    bibPretReseau,
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
    studiumLogin,
    udemHttp30xCalendrier,
]