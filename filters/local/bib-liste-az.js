export default {
    code: 'bib-liste-az',
    test: (report) => {
        return report.url.startsWith('https://boite-outils.bib.umontreal.ca/az.php') || /^https:\/\/boite\-outils\.bib\.umontreal\.ca\/[A-Za-z_]+/i.test(report.url)
    },
    level: 'error',
    exclude: true
}