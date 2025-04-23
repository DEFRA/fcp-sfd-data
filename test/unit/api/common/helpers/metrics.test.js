import { vi, describe, test, expect, beforeEach } from 'vitest'

import { config } from '../../../../../src/config/index.js'
import { createLogger } from '../../../../../src/logging/logger.js'
import { createMetricsLogger, StorageResolution, Unit } from 'aws-embedded-metrics'
import { metricsCounter } from '../../../../../src/api/common/helpers/metrics.js'

vi.mock('aws-embedded-metrics', async (originalImport) => {
  const actual = await originalImport()

  return {
    ...actual,
    createMetricsLogger: vi.fn().mockReturnValue({
      putMetric: vi.fn(),
      flush: vi.fn()
    })
  }
})

vi.mock('../../../../../src/logging/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  })
}))

const mockLogger = createLogger()
const mockMetricsLogger = createMetricsLogger()

const mockMetricsName = 'mock-metrics-name'
const defaultMetricsValue = 1
const mockValue = 200

describe('#metrics', () => {
  describe('When metrics is not enabled', () => {
    beforeEach(async () => {
      config.set('isMetricsEnabled', false)
      await metricsCounter(mockMetricsName, mockValue)
    })

    test('Should not call metric', () => {
      expect(mockMetricsLogger.putMetric).not.toHaveBeenCalled()
    })

    test('Should not call flush', () => {
      expect(mockMetricsLogger.flush).not.toHaveBeenCalled()
    })
  })

  describe('When metrics is enabled', () => {
    beforeEach(() => {
      config.set('isMetricsEnabled', true)
    })

    test('Should send metric with default value', async () => {
      await metricsCounter(mockMetricsName)

      expect(mockMetricsLogger.putMetric).toHaveBeenCalledWith(
        mockMetricsName,
        defaultMetricsValue,
        Unit.Count,
        StorageResolution.Standard
      )
    })

    test('Should send metric', async () => {
      await metricsCounter(mockMetricsName, mockValue)

      expect(mockMetricsLogger.putMetric).toHaveBeenCalledWith(
        mockMetricsName,
        mockValue,
        Unit.Count,
        StorageResolution.Standard
      )
    })

    test('Should call flush', async () => {
      await metricsCounter(mockMetricsName, mockValue)
      expect(mockMetricsLogger.flush).toHaveBeenCalled()
    })
  })

  describe('When metrics throws', () => {
    const mockError = 'mock-metrics-put-error'

    beforeEach(async () => {
      config.set('isMetricsEnabled', true)
      mockMetricsLogger.flush.mockRejectedValue(new Error(mockError))

      await metricsCounter(mockMetricsName, mockValue)
    })

    test('Should log expected error', () => {
      expect(mockLogger.error).toHaveBeenCalledWith(Error(mockError), mockError)
    })
  })
})
