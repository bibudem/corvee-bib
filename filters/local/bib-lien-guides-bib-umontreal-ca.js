// https://guides.bib.umontreal.ca/
export default {
  code: 'bib-lien-guides-bib-umontreal-ca',
  test: (report) => {
    if (report.url && report.url.startsWith('https://guides.bib.umontreal.ca') && report.httpStatusCode < 300) {
      report.finalUrl = null
      return report.url
    }
  }
}