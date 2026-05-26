export default {
  code: 'http-403',
  test: (report) => {
    return report.httpStatusCode === 403 || report.errorCodes?.includes('http-403')
  },
  exclude: true
}