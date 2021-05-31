export default {
    code: 'udem-ignore-urls',
    description: 'Misc URLs to ignore from umontreal.ca',
    test: (report) => {
        return (
            /^https?:\/\/donner\.umontreal\.ca/i.test(report.url)
        ) && report.httpStatusCode < 400
    },
    exclude: true
}