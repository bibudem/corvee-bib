import * as config from '../config/index.js'
import { filters as _, messagesFrCA } from 'corvee-processor'

export const standardFilters = [
    _.http30xAllTempRedirects,
    new _.Http30xPermanentRedirectSuccessful({
        level: 'error',
        // limit: 500
    }),
    _.http30xPermanentRedirectFailure,
    {
        ..._.http30xCircularRedirection,
        exclude: true // KEEP
    },
    {
        ..._.http30xSlash,
        exclude: true // KEEP
    },
    _.http30xHttpsUpgradeAny,
    new _.Http30xHttpsUpgradeLoose({
        ignoreWww: true,
        // exclude: true
    }),
    new _.Http30xHttpsUpgradeStrict({
        ignoreWww: false,
        level: 'error',
        priority: 1,
        // limit: 243,
        // exclude: true
    }),
    new _.Http30xRootToPathPermanentRedirect(),
    _.http30xRedirectToWelcomePage,
    _.http307HSTSRedirect,
    _.http404ByUrl(config.urlsAs404),

    // _.mailInvalidSyntax,

    _.netSystem,
    _.netConnection,
    _.netCertificate,
    _.netHttp,

    _.urlIgnoreThese(config.excludedUrls),
]

export const standardMessages = messagesFrCA