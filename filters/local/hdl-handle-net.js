export default {
  code: 'hdl-handle-net',
  test: (report) => {
    try {
      const url = new URL(report.url)
      if (url.hostname !== 'hdl.handle.net') {
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