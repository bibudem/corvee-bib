const pagesAvecCommuniqueWidget = [
    /^https:\/\/bib\.umontreal\.ca\/communications\/grands\-dossiers\/collections\-nouvelle\-ere\/udem\-dans\-les\-medias/i,
    /^https:\/\/bib\.umontreal\.ca\/communications\/grands\-dossiers\/collections\-nouvelle\-ere\/enjeux\-edition\-scientifique\//i
]

export default {
    code: 'bib-communication-lien-manquant',
    test: (report) => {
        const pageRegEx = pagesAvecCommuniqueWidget.find(page => page.test(report.parent))
        if (!report.extern && pageRegEx) {
            const urlPrefix = pageRegEx.exec(report.parent)[0]

            const url = `${urlPrefix}${urlPrefix.endsWith('/') ? `` : `/`}news/-/-/`

            if (report.url.startsWith(url) && report.parent.indexOf('news/-/-/') === -1) {
                return true
            }
        }

    }
}