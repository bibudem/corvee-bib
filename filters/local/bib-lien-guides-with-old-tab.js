export default {
  code: 'bib-lien-guides-with-old-tab',
  test: (report) => {
    if (typeof report.url !== 'undefined') {
      try {
        const url = new URL(report.url)
        if (url.hostname === 'bib.umontreal.ca' && url.searchParams.has('tab') && Number(url.searchParams.get('tab')) < 10000) {
          return true
        }
        return false
      }
      catch (e) {
        return false
      }
    }
  }
}