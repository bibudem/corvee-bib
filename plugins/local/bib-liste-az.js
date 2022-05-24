export default {
    code: 'bib-liste-az',
    test: report => {
        return report.url.startsWith('https://libguides.bib.umontreal.ca/') &&
            report.httpStatusCode === 301
        // if (report.url.startsWith('https://libguides.bib.umontreal.ca/') &&
        //     report.httpStatusCode === 301
        // ) {
        //     console.log(report)
        //     process.exit();
        // }
    },
    level: 'error',
    exclude: true
}