export default {
    code: 'udem-http-30x-calendrier',
    description: 'Excludes www.calendrier.umontreal.ca\'s events shorts URLs',
    test: (report) => {
        return /^https?:\/\/(www\.)?calendrier.umontreal.ca\/?\?/i.test(report.url) &&
            /[\?&]eID=\d+/i.test(report.url) &&
            report.httpStatusCode < 400
    },
    exclude: true
}