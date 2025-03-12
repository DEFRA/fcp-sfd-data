import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'

// urlToHttpOptions returns undefined
console.log('DOCKER_TEST env', process.env.DOCKER_TEST)
console.log('MONGO_URI env', process.env.MONGO_URI)
console.log('MONGO_URI_LOCAL env', process.env.MONGO_URI_LOCAL)
const url = config.get('mongo.urlToHttpOptions')

const client = new MongoClient(url)
await client.connect()
const db = client.db(config.get('mongo.database'))

const notificationsCollection = await db.collection('notifications')
const fileMetadataCollection = await db.collection('fileMetadata')

console.log('MongoDB connected')

export {
  db,
  client,
  notificationsCollection,
  fileMetadataCollection
}
