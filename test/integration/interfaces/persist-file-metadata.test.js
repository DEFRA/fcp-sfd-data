import { describe, test, expect, beforeEach } from '@jest/globals'
import { config } from '../../../src/config/index.js'
import { persistFileMetadata } from '../../../src/interfaces/persist-inbound.js'
// import { fileMetadataCollection, client } from '../../../src/data/db-connection.js'
import db from '../../../src/data/db.js'

import v1FileMetadata from '../../mocks/file-metadata/v1.js'

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await db.collection(fileMetadataCollection).deleteMany({})
  })

  test('should persist a record in the fileMetadata collection', async () => {
    await persistFileMetadata(v1FileMetadata)

    const result = await db.collection(fileMetadataCollection).find().toArray()
    expect(result).toBeDefined()
    expect(result.length).toBe(1)

    const savedFileMetadata = result[0]
    expect(savedFileMetadata).toMatchObject(v1FileMetadata)
  })
})
