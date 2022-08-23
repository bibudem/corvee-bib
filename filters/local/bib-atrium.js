export default {
    code: 'bib-atrium',
    test: (report) => {
        return 'url' in report && (report.url.startsWith('http://atrium.umontreal.ca') || report.url.startsWith('https://atrium.umontreal.ca'))
    },
    level: 'error'
}