import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'

console.log(config.get('mongo'))
const url = 'mongodb://mongodb:27017/'
// need a specific config value for local mongo vs deployed
// or a dynamic config value based on local/deployed
console.log(url)

const client = new MongoClient(url)
await client.connect()
console.log('MongoDB connected')
const db = client.db(config.get('mongo.database'))

export default db
