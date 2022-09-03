export default {
    code: 'bib-http-30x-redirection-typo3',
    test: (report) => {
        return report.url.startsWith('https://bib.umontreal.ca/') &&
            'redirectChain' in report &&
            report.redirectChain &&
            report.redirectChain.length > 0 &&
            report.redirectChain[0].status === 303
    },
    level: 'info'
}