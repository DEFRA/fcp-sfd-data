import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'

const url = config.get('mongo.urlToHttpOptions')

const client = new MongoClient(url)
await client.connect()
const db = client.db(config.get('mongo.database'))

const notificationsCollection = await db.collection('notifications')
const fileMetadataCollection = await db.collection('fileMetadata')

export {
  db,
  client,
  notificationsCollection,
  fileMetadataCollection
}
