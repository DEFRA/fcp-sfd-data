import { GraphQLScalarType, Kind } from 'graphql'

const invalidTypeError = 'Value must be either a string or an array of strings'

const parse = (value) => {
  const result = { value }
  const isValidArray = Array.isArray(value) &&
    value.every(item => typeof item === 'string')

  if (typeof value === 'string' || isValidArray) {
    return result
  }

  throw new Error(invalidTypeError)
}

const StringOrArray = new GraphQLScalarType({
  name: 'StringOrArray',
  description: 'Custom scalar that can be either a string or an array of strings',
  parseValue: (value) => {
    return parse(value).value
  },
  serialize: (value) => {
    return parse(value).value
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return ast.value
    }

    if (ast.kind === Kind.LIST) {
      return ast.values.map(value => {
        if (value.kind === Kind.STRING) {
          return value.value
        }
        throw new Error('List elements must be strings')
      })
    }

    throw new Error(invalidTypeError)
  }
})

export default StringOrArray
