import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from '../../src/api/index.js'
import { generateOpenapi } from '../../src/api/common/helpers/generate-openapi.js'

describe('generateOpenapi integration test', () => {
  let server
  const testOutputPath = './test-docs/openapi/v1.yaml'

  beforeAll(async () => {
    server = await createServer()
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(() => {
    const dir = path.dirname(testOutputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (fs.existsSync(testOutputPath)) {
      fs.unlinkSync(testOutputPath)
    }
  })

  test('should generate OpenAPI documentation file', async () => {
    await generateOpenapi(server, testOutputPath)
    const fileContent = fs.readFileSync(testOutputPath, 'utf8')

    expect(fs.existsSync(testOutputPath)).toBe(true)
    expect(fileContent).toContain('openapi:')
    expect(fileContent).toContain('paths:')
    expect(fileContent).toContain('info:')
    expect(fileContent).toContain('/api/v1/comms/events/id/{id}')
    expect(fileContent).toContain('/api/v1/comms/events/reference/{reference}')
  })

  test('should handle errors gracefully', async () => {
    const dir = path.dirname(testOutputPath)
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, { recursive: true })
    }

    await expect(generateOpenapi(server, testOutputPath)).rejects.toThrow()
  })
})
