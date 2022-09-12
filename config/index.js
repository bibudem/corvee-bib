import { harvesterConfig } from './harvester.js'

export { default as excludedUrls } from './excluded-urls.js'

import { default as devExcludedUrls } from './dev-excluded-urls.js'

// export excludedUrls;
export const urlsExcludedFromHarvester = harvesterConfig.ignore;
export const devExcludeUrls = [...devExcludedUrls, ...harvesterConfig.ignore];
export * from './adresses-simplifiees.js';
export * from './urls-as-404.js'
export * from './harvester.js'