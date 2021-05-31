export default {
    code: 'bib-pret-reseau',
    test: report => {
        return [
            'http://jupiter.bib.umontreal.ca/formulaires/pret-reseau.asp',
            'https://jupiter.bib.umontreal.ca/formulaires/pret-reseau.asp',
            'https://jupiter.bib.umontreal.ca/formulaires/livraison-documents.asp'
        ].includes(report.url);
    }
}