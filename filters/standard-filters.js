import * as config from '../config/index.js'
import { filters as _, messagesFrCA } from '@corvee/processor'

export const standardFilters = [
    _.http30xAllTempRedirects,
    _.http30xPermanentRedirectSuccessfull,
    _.http30xPermanentRedirectFailure,
    // _.http307,
    {
        ..._.http30xCircularRedirection,
        exclude: true // KEEP
    },
    {
        ..._.http30xMissingSlash,
        exclude: true // KEEP
    },
    _.http30xHttpsUpgradeAny,
    new _.http30xHttpsUpgradeLoose({
        ignoreWww: true
    }),
    new _.http30xHttpsUpgradeStrict({
        ignoreWww: false,
        level: 'info',
        limit: 1000,
        // exclude: true
    }),
    _.http30xWelcomePage,
    _.http307HSTSRedirect,
    // _.http400,
    // _.http401,
    // _.http403,
    // _.http404,
    _.http404ByUrl(config.urlsAs404),
    // _.http408,
    // _.http410,
    // _.http429,
    // _.http500,
    // _.http501,
    // _.http502,
    // _.http503,
    // _.http512599,

    // _.mailInvalidSyntax,
    // _.mailUnverifiedAddress,

    _.netSystem,
    _.netConnection,
    _.netCertificate,
    _.netHttp,

    _.urlIgnoreThese(config.excludedUrls),
    // _.urlInvalidUrl,
]

export const standardMessages = messagesFrCA;