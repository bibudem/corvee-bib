export default {
    code: 'bib-lien-developpement-webmestre',
    test: (report) => {
        return report.url.toLowerCase().startsWith('https://bib.umontreal.ca/dev/') &&
            !report.parent.toLowerCase().startsWith('https://bib.umontreal.ca/dev/');
    },
    // exclude: true
}