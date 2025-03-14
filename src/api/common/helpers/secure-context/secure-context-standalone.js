import tls from 'node:tls'
import { config } from '../../../config.js'
import { getTrustStoreCerts } from './get-trust-store-certs.js'

export function createSecureContext (options = {}) {
  if (config.get('isSecureContextEnabled')) {
    const originalTlsCreateSecureContext = tls.createSecureContext
    const trustStoreCerts = getTrustStoreCerts(process.env)

    if (!trustStoreCerts.length) {
      console.info('Could not find any TRUSTSTORE_ certificates')
    }

    const tlsSecureContext = originalTlsCreateSecureContext(options)

    trustStoreCerts.forEach((cert) => {
      tlsSecureContext.context.addCACert(cert)
    })

    return tlsSecureContext
  } else {
    console.info('Custom secure context is disabled')
  }
}
