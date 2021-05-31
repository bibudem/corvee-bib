// http://opurl.bib.umontreal.ca:8331/V/?func=native-link&resource=MON04447
export default {
  code: 'bib-permalien-sfx',
  test: (report) => {
    return /^https?:\/\/opurl\.bib\.umontreal\.ca:8331/i.test(report.url) && report.url.toLowerCase().indexOf('func=native-link') > 0 ? report.url : false;
  }
}