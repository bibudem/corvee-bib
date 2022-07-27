import { harvesterConfig } from './harvester'

export { default as excludedUrls } from './excluded-urls'

import { default as devExcludedUrls } from './dev-excluded-urls'

// export excludedUrls;
export const urlsExcludedFromHarvester = harvesterConfig.ignore;
export const devExcludeUrls = [...devExcludedUrls, ...harvesterConfig.ignore];
export * from './adresses-simplifiees';

export const urlsAs404 = [
    'erreur-404' // https://www.inesss.qc.ca/erreur-404-error.html
]

export * from './harvester'