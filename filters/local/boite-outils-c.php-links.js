export default {
    code: 'boite-outils-c.php-links',
    test: report => {
        if ('url' in report && report.parent.toLowerCase().startsWith('https://boite-outils.bib.umontreal.ca/')) {
            try {
                const url = new URL(report.url, report.parent)

                return url.hostname === 'boite-outils.bib.umontreal.ca'
                    && url.pathname.toLowerCase() === '/c.php'
            } catch (_) {
                return false
            }
        }

        return false
    },
    level: 'info'
}