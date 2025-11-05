
import { ServerApiVersion } from 'mongodb'

export const algoliasearchOptions = {
  applicationId: 'abcdef...',
  writeApiKey: 'api key',
  index: 'pages'
}

export const db = {
  url: 'mongodb://...:27017/',
  options: {
    auth: {
      username: 'some user',
      password: 'some password]85$9'
    },
    authSource: 'auth collection',
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  },
  name: 'corvee-prod'
}