export default {
  code: 'bib-lien-libguides-bib-umontreal-ca',
  test: (report) => {
    return 'url' in report
      && report.url.startsWith('https://libguides.bib.umontreal.ca')
      && report.parent.startsWith('https://libguides.bib.umontreal.ca')
  },
  exclude: true
}