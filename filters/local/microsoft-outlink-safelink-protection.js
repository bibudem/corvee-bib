export default {
  code: 'microsoft-safelink-protection',
  test: (report) => {
    try {
      const url = new URL(report.url)
      return url.hostname.endsWith('safelinks.protection.outlook.com')
    } catch (e) {
      return false
    }
  }
}