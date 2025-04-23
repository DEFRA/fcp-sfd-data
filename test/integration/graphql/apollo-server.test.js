import { afterEach, describe, test, expect, vi } from 'vitest'
import { DEVELOPMENT, TEST, PRODUCTION } from '../../../src/constants/environments.js'

afterEach(() => {
  vi.resetModules()
  delete process.env.ENVIRONMENT_CODE
})

describe('apollo server setup', () => {
  test('disable landing page plugin when environment code is production ', async () => {
    process.env.ENVIRONMENT_CODE = PRODUCTION
    const { apolloServer } = await import('../../../src/graphql/apollo-server.js')
    expect(apolloServer.internals.plugins[0].__internal_plugin_id__).toBe('LandingPageDisabled')
  })

  test('do not disable landing page when environment code is test ', async () => {
    process.env.ENVIRONMENT_CODE = TEST
    const { apolloServer } = await import('../../../src/graphql/apollo-server.js')
    expect(apolloServer.internals.plugins[0].__internal_plugin_id__).toBe(undefined)
  })

  test('do not disable landing page when environment code is development ', async () => {
    process.env.ENVIRONMENT_CODE = DEVELOPMENT
    const { apolloServer } = await import('../../../src/graphql/apollo-server.js')
    expect(apolloServer.internals.plugins[0].__internal_plugin_id__).toBe(undefined)
  })
})
