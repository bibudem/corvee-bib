export default {
    code: 'bib-lien-developpement-edimestre',
    test: report => {
        return report.url.startsWith('https://bib.umontreal.ca/developpement-edimestre') &&
            !report.parent.startsWith('https://bib.umontreal.ca/developpement-edimestre');
    },
    // exclude: true
}