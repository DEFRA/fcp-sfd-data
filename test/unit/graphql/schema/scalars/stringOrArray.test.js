import { Kind } from 'graphql'
import StringOrArray from '../../../../../src/graphql/schema/scalars/string-or-array.js'

describe('StringOrArray Scalar', () => {
  describe('parseValue', () => {
    test('should parse a string value', () => {
      expect(StringOrArray.parseValue('test')).toBe('test')
    })

    test('should parse an array of strings', () => {
      expect(StringOrArray.parseValue(['test1', 'test2'])).toEqual(['test1', 'test2'])
    })

    test('should throw an error for non-string or non-array values', () => {
      expect(() => StringOrArray.parseValue(123)).toThrow('Value must be either a string or an array of strings')
      expect(() => StringOrArray.parseValue({})).toThrow('Value must be either a string or an array of strings')
    })
  })

  describe('serialize', () => {
    test('should serialize a string value', () => {
      expect(StringOrArray.serialize('test')).toBe('test')
    })

    test('should serialize an array of strings', () => {
      expect(StringOrArray.serialize(['test1', 'test2'])).toEqual(['test1', 'test2'])
    })

    test('should throw an error for non-string or non-array values', () => {
      expect(() => StringOrArray.serialize(123)).toThrow('Value must be either a string or an array of strings')
      expect(() => StringOrArray.serialize({})).toThrow('Value must be either a string or an array of strings')
    })
  })

  describe('parseLiteral', () => {
    test('should parse a string literal', () => {
      const ast = { kind: Kind.STRING, value: 'test' }
      expect(StringOrArray.parseLiteral(ast)).toBe('test')
    })

    test('should parse a list of string literals', () => {
      const ast = {
        kind: Kind.LIST,
        values: [
          { kind: Kind.STRING, value: 'test1' },
          { kind: Kind.STRING, value: 'test2' }
        ]
      }
      expect(StringOrArray.parseLiteral(ast)).toEqual(['test1', 'test2'])
    })

    test('should throw an error for non-string or non-list literals', () => {
      const ast = { kind: Kind.INT, value: 123 }
      expect(() => StringOrArray.parseLiteral(ast)).toThrow('Value must be either a string or an array of strings')
    })

    test('should throw an error for list elements that are not strings', () => {
      const ast = {
        kind: Kind.LIST,
        values: [
          { kind: Kind.STRING, value: 'test1' },
          { kind: Kind.INT, value: 123 }
        ]
      }
      expect(() => StringOrArray.parseLiteral(ast)).toThrow('List elements must be strings')
    })
  })
})
