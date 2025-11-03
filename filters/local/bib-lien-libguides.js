export default {
  code: 'bib-lien-libguides',
  description: 'Trouve tous les liens directs vers l\'interface publique de LibGuides.',
  test: (report) => {
    return report.url.startsWith('https://libguides.bib.umontreal.ca/')

  }
}