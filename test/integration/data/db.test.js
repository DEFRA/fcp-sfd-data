import { describe, test, expect } from '@jest/globals'
import { db, client } from '../../../src/data/index.js'

describe('Create Mongo client', () => {
  test('should return an instance of database client', async () => {
    expect(db).toBeDefined()
    expect(db.s.namespace.db).toBe('fcp-sfd-data')
    expect(db.databaseName).toBe('fcp-sfd-data')
  })

  test('should have a connected MongoDB client', async () => {
    expect(client).toBeDefined()
    expect(client.topology.isConnected()).toBe(true)
  })

  test('db client should be able to upload data to collection', async () => {
    const uploadResult = await db.collection('test').insertOne({ test: 'test' })
    expect(uploadResult.acknowledged).toBe(true)
  })

  test('db client should be able to retrieve from collection', async () => {
    const queryResult = await db.collection('test').findOne({ test: 'test' })
    expect(queryResult.test).toBe('test')
  })
})
