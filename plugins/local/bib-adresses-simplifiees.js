export function isAdresseSimplifiee({
    urls = [],
    exclude = false
} = {}) {
    return {
        code: `bib-adresses-simplifiees`,
        test: report => {
            return urls.find(testUrl => typeof testUrl === 'string' ? report.url.includes(testUrl) : testUrl.test(report.url))
        },
        level: 'info',
        exclude
    }
}

export function isBadAdresseSimplifiee({
    urls = [],
    exclude = false
} = {}) {

    const badUrls = urls.map(url => {
        if (typeof url === 'string') {
            return url.replace('https', 'http')
        }
        const flags = url.flags,
            src = url.source;

        return new RegExp(src.replace('https', 'http'), flags);
    })

    function isBadUrl(url) {
        return badUrls.find(testUrl => typeof testUrl === 'string' ? url.includes(testUrl) : testUrl.test(url))
    }

    return {
        code: `bib-bad-adresses-simplifiees`,
        test: report => {
            const b = isBadUrl(report.url);
            if (b) {
                // console.warn(report.url)
                return report.url;
            }
        },
        exclude
    }
}