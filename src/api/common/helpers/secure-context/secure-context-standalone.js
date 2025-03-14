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

export { createSecureContext }
