import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'

import { createLogger } from '../logging/logger.js'

import { config } from '../../../../config/index.js'

const logger = createLogger()

export const setupProxy = () => {
  const proxyUrl = config.get('httpProxy')

  if (proxyUrl) {
    logger.info('setting up global proxies')

    setGlobalDispatcher(new ProxyAgent(proxyUrl))

    bootstrap()
    global.GLOBAL_AGENT.HTTP_PROXY = proxyUrl
  }
}
