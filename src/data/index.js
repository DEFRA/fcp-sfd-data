import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'

console.log(config.get('mongo')) // urlToHttpOptions returns undefined
const url = 'mongodb://mongodb:27017/'
// need a specific config value for local mongo vs deployed
// or a dynamic config value based on local/deployed

const client = new MongoClient(url)
await client.connect()
const db = await client.db(config.get('mongo.database'))

const notificationsCollection = await db.collection('notifications')
const fileMetadataCollection = await db.collection('fileMetadata')

console.log('MongoDB connected')

export {
  db,
  client,
  notificationsCollection,
  fileMetadataCollection
}
