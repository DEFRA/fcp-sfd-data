import tls from 'node:tls'

import { config } from '../../../../config/index.js'
import { getTrustStoreCerts } from './get-trust-store-certs.js'

const createSecureContext = (logger, options = {}) => {
  if (config.get('isSecureContextEnabled')) {
    const originalTlsCreateSecureContext = tls.createSecureContext
    const trustStoreCerts = getTrustStoreCerts(process.env)

    if (!trustStoreCerts.length) {
      logger.info('Could not find any TRUSTSTORE_ certificates')
    }

    const tlsSecureContext = originalTlsCreateSecureContext(options)

    trustStoreCerts.forEach((cert) => {
      tlsSecureContext.context.addCACert(cert)
    })

    return tlsSecureContext
  } else {
    logger.info('Custom secure context is disabled')
  }
}

export const secureContext = {
  plugin: {
    name: 'secure-context',
    register (server) {
      if (config.get('isSecureContextEnabled')) {
        server.decorate('server', 'secureContext', createSecureContext(server.logger))
      } else {
        server.logger.info('Custom secure context is disabled')
      }
    }
  }
}
