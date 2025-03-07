import { describe, test, expect } from '@jest/globals'
import db from '../../../src/data/index.js'

describe('Create Mongo client', () => {
  test('should return an instance of database client', async () => {
    expect(db).toBeDefined()
    expect(db.s.namespace.db).toBe('fcp-sfd-data')
    expect(db.databaseName).toBe('fcp-sfd-data')
  })
})
