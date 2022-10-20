export default {
    code: 'bib-liste-az',
    test: (report) => {
        return report.url.startsWith('https://libguides.bib.umontreal.ca/az.php')
            || /^https:\/\/libguides\.bib\.umontreal\.ca\/[A-Za-z_]+/i.test(report.url)
    },
    level: 'error',
    exclude: true
}