import { expect, jest } from '@jest/globals'
import { TEST, DEVELOPMENT } from '../../src/constants/environments.js'

describe('GraphQL Config', () => {
  afterEach(() => {
    delete process.env.ENVIRONMENT_CODE
    jest.resetModules()
  })

  test('should return true for test environment', async () => {
    process.env.ENVIRONMENT_CODE = TEST
    const { graphqlConfig } = await import('../../src/config/graphql.js')
    const config = graphqlConfig.get('enableIntrospection')
    expect(config).toBe(true)
  })

  test('should return true for dev environment', async () => {
    process.env.ENVIRONMENT_CODE = DEVELOPMENT
    const { graphqlConfig } = await import('../../src/config/graphql.js')
    const config = graphqlConfig.get('enableIntrospection')
    expect(config).toBe(true)
  })

  test('should return false for production environment', async () => {
    process.env.ENVIRONMENT_CODE = 'prod'
    const { graphqlConfig } = await import('../../src/config/graphql.js')
    const config = graphqlConfig.get('enableIntrospection')
    expect(config).toBe(false)
  })

  test('should return false for undefined environment', async () => {
    const { graphqlConfig } = await import('../../src/config/graphql.js')
    const config = graphqlConfig.get('enableIntrospection')
    expect(config).toBe(false)
  })
})
