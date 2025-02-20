import { jest, describe, test, expect, beforeAll } from '@jest/globals'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

jest.unstable_mockModule('../../../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const mockServer = {
  start: jest.fn(),
  stop: jest.fn(),
  logger: {
    info: mockLoggerInfo,
    error: mockLoggerError
  }
}

jest.unstable_mockModule('../../../../../src/api/index.js', () => ({
  createServer: jest.fn().mockResolvedValue(mockServer)
}))

const { config } = await import('../../../../../src/config/index.js')
const { createServer } = await import('../../../../../src/api/index.js')
const { startServer } = await import('../../../../../src/api/common/helpers/start-server.js')

describe('#startServer', () => {
  beforeAll(async () => {
    config.set('port', 3098)
  })

  describe('When server starts', () => {
    test('Should start up server as expected', async () => {
      await startServer()

      expect(createServer).toHaveBeenCalled()

      expect(mockLoggerInfo).toHaveBeenNthCalledWith(
        1,
        'Server started successfully'
      )
      expect(mockLoggerInfo).toHaveBeenNthCalledWith(
        2,
        'Access your backend on http://localhost:3098'
      )
    })
  })

  describe('When server start fails', () => {
    beforeAll(() => {
      createServer.mockRejectedValue(Error('Server failed to start'))
    })

    test('Should log failed startup message', async () => {
      await startServer()

      expect(mockLoggerInfo).toHaveBeenCalledWith('Server failed to start :(')
      expect(mockLoggerError).toHaveBeenCalledWith(
        Error('Server failed to start')
      )
    })
  })
})
