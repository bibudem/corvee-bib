export default {
  code: 'doi-org',
  test: (report) => {
    try {
      const url = new URL(report.url)
      if (url.hostname !== 'doi.org') {
        return false
      }

      if (!'redirectChain' in report || report.redirectChain.length === 0) {
        return false
      }

      return report.redirectChain[report.redirectChain.length - 1].status === 200
    } catch (error) {
      return false
    }

  },
  level: 'info',
  exclude: true
}