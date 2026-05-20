// http://opurl.bib.umontreal.ca:8331/V/?func=native-link&resource=MON04447
export default {
  code: 'http-403',
  test: (report) => {
    return report.errorCodes?.includes('http-403')
  },
  exclude: true
}