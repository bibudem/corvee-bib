export default {
    code: 'external-ignore-urls',
    description: 'Misc URLs to ignore from the Web',
    test: (report) => {
        return (
            /^https?:\/\/dx\.doi\.org/i.test(report.url)
            || /^https?:\/\/doi\.org\//i.test(report.url)
            || /^https?:\/\/collections\.banq\.qc\.ca\/ark:/i.test(report.url) // permaliens Banq
            || report.url === 'http://www.youtube.com/user/BibliothequesUdeM'
            || report.url === 'https://soquij.qc.ca'
        ) && report.httpStatusCode < 400
    },
    exclude: true
}