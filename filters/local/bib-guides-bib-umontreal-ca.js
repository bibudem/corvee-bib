// https://guides.bib.umontreal.ca/
export default {
  code: 'bib-guides-bib-umontreal-ca',
  test: (report) => {
    return 'url' in report && (report.url.startsWith('https://guides.bib.umontreal.ca'))
  }
}