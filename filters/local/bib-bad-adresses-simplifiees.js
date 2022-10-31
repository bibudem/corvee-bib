const CODE = `bib-bad-adresses-simplifiees`

/**
 * @protected
 * @typedef { Array<string|RegExp> } UrlParamType
 */

/**
 *
 *
 * @param {object} params
 * @param { UrlParamType } params.urls
 * @param {boolean} [params.exclude = false]
 * @param {number} [params.priority = 1]
 * 
 * @returns {object}
 */
export default function isBadAdresseSimplifiee({
    urls = [],
    exclude = false,
    priority = 0
}) {

    const badUrls = urls.map(url => {
        if (typeof url === 'string') {
            return url.replace('https:', 'http:')
        }
        const flags = url.flags,
            src = url.source;

        return new RegExp(src.replace('https:', 'http:'), flags);
    })

    /**
     * @param {UrlParamType} url
     */
    function isBadUrl(url) {
        return badUrls.find(testUrl => typeof testUrl === 'string' ? url.includes(testUrl) : testUrl.test(url))
    }

    return {
        code: CODE,
        test: record => {
            const b = isBadUrl(record.url);
            if (b) {

                return record.url.replace('http:', 'https:').replace('www.', '');
            }
        },
        exclude,
        priority
    }
}