export default {
    code: 'pup-timeout-redirect',
    test: (record) => {
        return record.finalUrl !== null && record.url !== record.finalUrl && record.httpStatusCode === null && record.reports.some(report => report.code === 'pup-timeout')
    },
    level: 'error'
}