import { Kind } from 'graphql'
import TimestampType from '../../../../../src/graphql/schema/scalars/timestamp.js'

describe('TimestampType', () => {
  describe('serialize', () => {
    test('should serialize a Date object to an ISO string', () => {
      const date = new Date('2023-01-01T00:00:00Z')
      const result = TimestampType.serialize(date)
      expect(result).toBe('2023-01-01T00:00:00.000Z')
    })

    test('should serialize a timestamp to an ISO string', () => {
      const timestamp = 1672531200000 // Equivalent to 2023-01-01T00:00:00Z
      const result = TimestampType.serialize(timestamp)
      expect(result).toBe('2023-01-01T00:00:00.000Z')
    })
  })

  describe('parseValue', () => {
    test('should parse an ISO string to a Date object', () => {
      const isoString = '2023-01-01T00:00:00Z'
      const result = TimestampType.parseValue(isoString)
      expect(result).toEqual(new Date(isoString))
    })

    test('should parse a timestamp to a Date object', () => {
      const timestamp = 1672531200000 // Equivalent to 2023-01-01T00:00:00Z
      const result = TimestampType.parseValue(timestamp)
      expect(result).toEqual(new Date(timestamp))
    })
  })

  describe('parseLiteral', () => {
    test('should parse an INT literal to a Date object', () => {
      const ast = { kind: Kind.INT, value: '1672531200000' } // Equivalent to 2023-01-01T00:00:00Z
      const result = TimestampType.parseLiteral(ast)
      expect(result).toEqual(new Date(1672531200000))
    })

    test('should parse a STRING literal to a Date object', () => {
      const ast = { kind: Kind.STRING, value: '2023-01-01T00:00:00Z' }
      const result = TimestampType.parseLiteral(ast)
      expect(result).toEqual(new Date('2023-01-01T00:00:00Z'))
    })

    test('should return null for non-INT and non-STRING literals', () => {
      const ast = { kind: Kind.BOOLEAN, value: 'true' }
      const result = TimestampType.parseLiteral(ast)
      expect(result).toBeNull()
    })
  })
})
