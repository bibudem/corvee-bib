export default {
    code: 'bib-lien-guide',
    test: report => {
        return /^https?:\/\/guides\.bib\.umontreal\.ca\/embed/i.test(report.parent) &&
            /^https?:\/\/guides\.bib\.umontreal\.ca\/embed/i.test(report.url)
    }
}