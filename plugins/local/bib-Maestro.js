// http://opurl.bib.umontreal.ca:8331/V/?func=native-link&resource=MON04447
export default {
  code: 'bib-Maestro',
  test: (report) => {
    return /^https?:\/\/opurl\.bib\.umontreal\.ca:8331/i.test(report.url) ? report.url : false;
  }
}