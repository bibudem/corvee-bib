export default {
    code: 'bib-lien-guide-embed',
    test: (report) => {
        return /^https?:\/\/guides\.bib\.umontreal\.ca\/embed/i.test(report.parent) &&
            /^https?:\/\/guides\.bib\.umontreal\.ca\/embed/i.test(report.url)
    }
}