export default {
    code: 'boite-outils-welcome-redirect',
    test: report => {
        return 'url' in report
            && report.url === 'https://boite-outils.bib.umontreal.ca/'
            && report.finalUrl === 'https://boite-outils.bib.umontreal.ca/c.php?g=739631'
    },
    level: 'info',
    exclude: true
}