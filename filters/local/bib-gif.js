export default {
  code: 'bib-gif',
  test: (report) => {
    if (/^https?:\/\/jupiter\.bib\.umontreal\.ca\/gif/i.test(report.url)) {
      return report.url
    }
  },
  level: 'error'
}