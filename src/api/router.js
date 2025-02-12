import { health } from '~/src/api/health/index.js'
import { example } from '~/src/api/example/index.js'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health])

      await server.register([example])
    }
  }
}

export { router }
