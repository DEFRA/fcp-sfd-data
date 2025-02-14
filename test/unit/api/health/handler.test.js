import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'

import { createServer } from '../../../../src/api/index.js'
import { StatusCodes } from 'http-status-codes'

describe('#healthHandler', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected response', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(result).toEqual({ message: 'success' })
    expect(statusCode).toBe(StatusCodes.OK)
  })
})
