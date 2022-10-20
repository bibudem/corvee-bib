export default {
  code: 'bib-lien-libguides-natif',
  description: 'Trouve tous les liens directs vers l\'interface publique de LibGuides, à l\'exception des liens de la liste de bases de données de A à Z.',
  test: (report) => {
    return report.url.startsWith('https://libguides.bib.umontreal.ca/')
      && !(
        report.url.startsWith('https://libguides.bib.umontreal.ca/az.php')
        || /^https:\/\/libguides\.bib\.umontreal\.ca\/[A-Za-z_]+/i.test(report.url)
      )

  }
}