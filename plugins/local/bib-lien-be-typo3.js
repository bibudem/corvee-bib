export default {
    code: 'bib-lien-be-typo3',
    test: report => {
        return report.url.startsWith('https://bib.umontreal.ca/index.php?');
    }
}