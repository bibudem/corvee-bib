// http://go.microsoft.com/fwlink/
export default {
  code: 'microsoft-forward-link',
  test: (report) => {
    return /\/\/go\.microsoft\.com\/fwlink\//i.test(report.url) ? report.url : false;
  }
}