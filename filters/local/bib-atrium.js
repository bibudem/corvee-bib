export default {
    code: 'bib-atrium',
    test: (report) => {
        return /^https?:\/\/atrium\.umontreal\.ca/i.test(report.url)
    },
    level: 'error'
}