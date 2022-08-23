export default {
  code: 'sofia-redirection-linker2',
  test: report => {
    return report.url.startsWith('https://linker2.worldcat.org?jHome=')
  },
  exclude: true
}