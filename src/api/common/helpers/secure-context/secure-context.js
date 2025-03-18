import tls from 'node:tls'

import { config } from '../../../../config/index.js'
import { getTrustStoreCerts } from './get-trust-store-certs.js'

export const createSecureContext = (logger) => {
  if (config.get('isSecureContextEnabled')) {
    const originalTlsCreateSecureContext = tls.createSecureContext

    tls.createSecureContext = function (options = {}) {
      const trustStoreCerts = getTrustStoreCerts(process.env)

      if (!trustStoreCerts.length) {
        logger.info('Could not find any TRUSTSTORE_ certificates')
      }

      const tlsSecureContext = originalTlsCreateSecureContext(options)

      trustStoreCerts.forEach((cert) => {
        tlsSecureContext.context.addCACert(cert)
      })

      return tlsSecureContext
    }

    return tls.createSecureContext()
  }

  return null
}

export const secureContext = {
  plugin: {
    name: 'secure-context',
    register (server) {
      const context = createSecureContext(server.logger)

      if (context) {
        server.decorate('server', 'secureContext', context)
      } else {
        server.logger.info('Custom secure context is disabled')
      }
    }
  }
}
