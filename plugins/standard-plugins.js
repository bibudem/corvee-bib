import * as config from '../config'
import {
    plugins as _,
    messages
}
    from '../../corvee/packages/processor'

export const standardPlugins = [{
    ..._.http200,
    // exclude: true // KEEP
},
{
    ..._.http30xAllTempRedirects,
    //  exclude: true
},
_.http30xPermanentRedirect,
_.http307,
{
    ..._.http30xMissingSlash,
    exclude: true // KEEP
},
_.http30xWelcomePage,
{
    ..._.http30xCircularRedirection,
    exclude: true // KEEP
},
new _.http30xHttpsUpgrade({
    ignoreWww: false,
    exclude: true
}),
new _.http30xHttpsUpgradeLoose({
    ignoreWww: true
}),
_.http30xHttpsUpgradeAny,
_.http400,
_.http401,
_.http403,
_.http404,
_.http404ByUrls(config.urlsAs404),
_.http500,
_.http501,
_.http502,
_.http503,
_.http550,
_.net,
_.urlIgnoreThese(config.excludedUrls),

    //
    //
    //

    // {
    //     code: 'only-errors-or-warnings',
    //     exclude: true,
    //     test: record => !record.reports.some(report => report.level === 'info')
    // }
]

export const standardMessages = messages;