import { harvesterConfig } from './harvester'

export { default as excludedUrls } from './excluded-urls'

import { default as devExcludedUrls } from './dev-excluded-urls'

// export excludedUrls;
export const urlsExcludedFromHarvester = harvesterConfig.ignore;
export const devExcludeUrls = [...devExcludedUrls, ...harvesterConfig.ignore];
export * from './adresses-simplifiees';

export const urlsAs404 = [
    'erreur-404', // https://www.inesss.qc.ca/erreur-404-error.html
    /code=404($|#|\?)/i, // https://methods.sagepub.com/error/handleStatusCode?code=404
    /404\.(aspx|php|html?)/i, // http://www.cmq.org/erreurs/404.aspx?lang=fr&aspxerrorpath=%2fhub%2ffr%2fetudes-medicales-demandes-permis.asp, https://www.gatineau.ca/portail/default.aspx?p=404&r=&u=http%3a%2f%2fwww.gatineau.ca%2f404.html%3faspxerrorpath%3d%2fdonneesouvertes%2fdefault_fr.aspx
    /\/404($|\?|#)/, // https://soquij.qc.ca/a/fr/404, https://agriculture.canada.ca/fr/system/404?destination=/en&_exception_statuscode=404
    'page_404?', // https://www.csse.org/site/page_404?url=https://www.csse.org/index.html
]

export * from './harvester'