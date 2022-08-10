export default {
  code: 'bib-lien-libguides',
  test: (report) => {
    return 'url' in report
      && (
        report.url.startsWith('https://libguides.bib.umontreal.ca/c.php')
        || report.url.startsWith('https://libguides.bib.umontreal.ca/sb.php')
        || report.url.startsWith('https://libguides.bib.umontreal.ca/srch.php')
        || report.url.startsWith('https://umontreal.libapps.com/')
      )

  }
}