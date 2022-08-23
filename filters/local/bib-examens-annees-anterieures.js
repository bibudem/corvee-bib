export default {
    code: 'bib-examens-annees-anterieures',
    test: report => {
        return 'url' in report &&
            typeof report.url === 'string' &&
            report.url.toLowerCase().startsWith('https://jupiter.bib.umontreal.ca/campus/eaa-examens/exams.asp')
    },
    level: 'info',
    exclude: true
}