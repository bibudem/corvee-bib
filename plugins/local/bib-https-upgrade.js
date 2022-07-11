export default {
    code: 'bib-https-upgrade',
    test: (report) => {
        if ('httpStatusCode' in report &&
            report.httpStatusCode < 400 &&
            'url' in report &&
            /^http:\/\/([^\.]+\.)?bib\.umontreal\.ca/.test(report.url) &&
            !report.url.startsWith('http://docs.bib.umontreal.ca')) {
            return report.finalUrl
        }
    },
    level: 'warning'
}