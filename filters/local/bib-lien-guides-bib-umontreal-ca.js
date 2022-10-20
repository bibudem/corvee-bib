// https://guides.bib.umontreal.ca/
export default {
  code: 'bib-guides-bib-umontreal-ca',
  test: (report) => {
    if (report.url && report.url.startsWith('https://guides.bib.umontreal.ca')) {
      return report.url
    }
  }
}