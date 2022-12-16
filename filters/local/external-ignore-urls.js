export default {
    code: 'external-ignore-urls',
    description: 'Misc URLs to ignore from the Web',
    test: (report) => {
        return (
            (
                /^https?:\/\/dx\.doi\.org/i.test(report.url)
                || /^https?:\/\/doi\.org\//i.test(report.url)
                || /^https?:\/\/collections\.banq\.qc\.ca\/ark:/i.test(report.url) // permaliens Banq) 
            )
            && report.httpStatusCode < 400
        )
            || report.url === 'https://soquij.qc.ca'
            || report.url.startsWith('https://canliiconnects.org') && report.httpStatusCode === 404 // Faux 404. C'est en réalité un 200
            || (
                report.url.startsWith('https://www.icrc.org')
                && report.httpStatusCode === 403 // Faux 403. C'est en réalité un 200
            )
            || (
                report.url.startsWith('https://www.lawblogs.ca')
                && report.httpStatusCode === 403 // Faux 403. C'est en réalité un 200
            )
            || report.url.startsWith('https://news.google.com/')
    },
    exclude: true
}