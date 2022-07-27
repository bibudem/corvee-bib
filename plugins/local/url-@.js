export default {
  code: 'url-@',
  level: 'info',
  test: (record) => {
    return record.reports.length > 0
      && record.reports.some(report => report.code === 'url-invalid-url')
      && record.urlData.indexOf('@') > 0
  },
  exclude: true
}