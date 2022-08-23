export default {
  code: 'bib-permalien-bib-umontreal-ca',
  test: report => {
    return report.url.startsWith('http://permalien.bib.umontreal.ca/')
  },
  level: 'info',
  exclude: true
}