export default {
    code: 'bib-atrium-non-securise',
    test: (report) => {
        return 'url' in report && report.url.startsWith('http://atrium.umontreal.ca')
    },
    level: 'warning'
}