import { HttpReport } from 'corvee-harvester'

export default {
  code: 'sofia-reponse-503',
  test: record => {
    if (
      /^http:\/\/www\.worldcat\.org\/oclc\/\d+$/i.test(record.url)
      && record.httpStatusCode === 503
      && record.reports?.length > 0
    ) {
      record.reports = record.reports.filter(report => report.code !== 'http-503')
      record.redirectChain = record.redirectChain.map(chain => {
        chain.url = chain.url.replace(/^http:/i, 'https:')
        return chain
      })
      record.redirectChain.unshift({
        url: record.url.replace(/^http:/i, 'https:'),
        status: 307,
        statusText: 'Internal Redirect'
      })
      record.reports.push(new HttpReport(record.redirectChain[record.redirectChain.length - 1].status))
      record.redirectChain[record.redirectChain.length - 1].status = 200
      record.redirectChain[record.redirectChain.length - 1].statusText = ''
      record.httpStatusCode = record.reports[record.reports.length - 1]?.status || 200
      record.finalUrl = record.finalUrl.replace(/^http:/i, 'https:')

      return record
    }
  }
}