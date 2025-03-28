import { describe, test, expect, jest } from '@jest/globals'
import { graphqlPlugin } from '../../../src/graphql/graphql-plugin.js'
import hapiApollo from '@as-integrations/hapi'
import { apolloServer } from '../../../src/graphql/apollo-server.js'

jest.mock('@as-integrations/hapi', () => ({
  default: {
    register: jest.fn()
  }
}))

describe('GraphQL Plugin', () => {
  test('should register the Apollo Server plugin with correct configuration', async () => {
    const mockServer = {
      register: jest.fn()
    }

    await graphqlPlugin.plugin.register(mockServer)

    expect(mockServer.register).toHaveBeenCalledWith({
      plugin: hapiApollo.default,
      options: {
        apolloServer,
        path: '/graphql'
      }
    })
  })

  test('should have the correct plugin name', () => {
    expect(graphqlPlugin.plugin.name).toBe('graphql')
  })
})
