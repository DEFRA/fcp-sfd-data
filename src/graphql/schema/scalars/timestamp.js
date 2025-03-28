import { GraphQLScalarType, Kind } from 'graphql'

const timestamp = new GraphQLScalarType({
  name: 'Timestamp',
  description:
    'The javascript `Date` as ISO string. Type represents date and time in ISO 8601 format.',

  serialize (value) {
    return new Date(value).toISOString()
  },

  parseValue (value) {
    return new Date(value)
  },

  parseLiteral (ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  }
})

export default timestamp
