export default {
    code: 'bib-liste-az',
    test: report => {
        return report.url.startsWith('https://libguides.bib.umontreal.ca/')
    },
    level: 'error',
    exclude: true
}