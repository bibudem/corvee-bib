export default {
    code: 'bib-ancien-atrium',
    test: (report) => {
        return /jupiter\.bib\.umontreal\.ca\/geoweb5|proxy\.umontreal\.ca\/cgi-bin\/bib\/geoweb5|http:\/\/atrium\.umontreal\.ca\/primo_library/i.test(report.url) ? report.url : false;
    }
}