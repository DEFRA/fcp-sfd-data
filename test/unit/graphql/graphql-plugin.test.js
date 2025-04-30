import { vi, describe, test, expect } from 'vitest'
import { graphqlPlugin } from '../../../src/graphql/graphql-plugin.js'
import hapiApollo from '@as-integrations/hapi'
import { apolloServer } from '../../../src/graphql/apollo-server.js'

vi.mock('@as-integrations/hapi', () => ({
  default: {
    register: vi.fn()
  }
}))

describe('GraphQL Plugin', () => {
  test('should register the Apollo Server plugin with correct configuration', async () => {
    const mockServer = {
      register: vi.fn()
    }

    await graphqlPlugin.plugin.register(mockServer)

    expect(mockServer.register).toHaveBeenCalledWith({
      plugin: hapiApollo.default,
      options: {
        apolloServer,
        path: '/graphql',
        context: expect.any(Function)
      }
    })
  })

  test('should have the correct plugin name', () => {
    expect(graphqlPlugin.plugin.name).toBe('graphql')
  })
})
