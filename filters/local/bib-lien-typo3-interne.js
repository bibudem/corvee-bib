export default {
    code: 'bib-lien-typo3-interne',
    test: report => {
        return !report.extern && (report.url.startsWith('https://bib.umontreal.ca/index.php?id=') || report.url.startsWith('https://bib.umontreal.ca/?id='))
    }
}