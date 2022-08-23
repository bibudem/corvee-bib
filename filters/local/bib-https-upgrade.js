export default {
    code: 'bib-https-upgrade',
    test: (report) => {
        if ('httpStatusCode' in report &&
            report.httpStatusCode < 400 &&
            report.httpStatusCode >= 300 &&
            'url' in report &&
            report.url.indexOf('bib.umontreal.ca') > 0) {
            const finalUrl = report.url.replace('http:', 'https:')
            if (report.finalUrl === finalUrl) {
                return report.finalUrl
            }
        }
    },
    level: 'error'
}