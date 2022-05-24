import * as config from '../config'

// local plugins
import {
    isBadAdresseSimplifiee
} from './local/bib-adresses-simplifiees'
import bibHttpsUpgrade from './local/bib-https-upgrade'
import bibAncienAtrium from './local/bib-ancien-atrium'
import bibAtriumNonSecurise from './local/bib-atrium-non-securise'
import bibAtrium from './local/bib-atrium'
import bibExamensAnneesAnterieures from './local/bib-examens-annees-anterieures'
import bibHttp30xRedirectionTypo3 from './local/bib-http-30x-redirection-typo3'
import bibLienBeTypo3 from './local/bib-lien-be-typo3'
import bibLienGuides from './local/bib-liens-guides'
import bibListeAZ from './local/bib-liste-az'
import bibPermalienSfx from './local/bib-permalien-sfx'
import bibPretReseau from './local/bib-pret-reseau'

import externalIgnoreUrls from './local/external-ignore-urls'
import microsoft from './local/microsoft-forward-link'
import publicAuthServices from './local/public-auth-services'

import studiumLogin from './local/studium-login'
import udemHttp30xCalendrier from './local/udem-http-30x-calendrier'
import udemIgnoreUrls from './local/udem-ignore-urls'

import messages from './local/messages'

export const localMessages = messages;

// export const localPlugins = {
//     // bibHttp30xRedirectionTypo3,
//     // udemHttp30xCalendrier,
//     bibHttpsUpgrade,
//     // bibAncienAtrium,
//     // bibAtriumNonSecurise,
//     // bibExamensAnneesAnterieures,
//     // bibPretReseau,
//     // isAdresseSimplifiee,
//     // isBadAdresseSimplifiee,
//     publicAuthServices,
//     // studiumLogin,
//     // excludeUrls,
// }



export const localPlugins = [
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
    bibLienBeTypo3,
    bibLienGuides,
    {
        ...bibListeAZ,
        priority: 1
    },
    {
        ...bibPermalienSfx,
        exclude: true
    },
    {
        ...bibHttpsUpgrade,
        exclude: true
    },
    bibPretReseau, {
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
    studiumLogin,
    udemHttp30xCalendrier,
    {
        ...udemIgnoreUrls,
        exclude: true
    }
]