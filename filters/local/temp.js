export default {
  code: 'temp',
  test: (report) => {
    return 'url' in report &&
      report.url.startsWith('https://guides.bib.umontreal.ca') &&
      report.parent.startsWith('https://guides.bib.umontreal.ca')
  },
  exclude: true
}