
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
      password: 'some password'
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

export const dbLocal = {
  url: 'mongodb://localhost:27017/',
  options: {
    auth: {
      username: 'some user',
      password: 'some password'
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