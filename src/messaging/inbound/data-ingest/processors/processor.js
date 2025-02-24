import { COMMS_EVENT, FILE_METADATA } from '../../../../constants/message-types.js'
import UnprocessableMessageError from '../../../../errors/unprocesable-message.js'

import { processV1CommsData, processV2CommsData } from './comms.js'
import { processV1FileMetadata, processV2FileMetadata } from './file-metadata.js'

const getCommsProcessor = (message) => {
  if (message?.type?.startsWith('uk.gov.fcp.sfd.notification.')) {
    return processV2CommsData
  }

  if (message.hasOwnProperty(COMMS_EVENT)) { // eslint-disable-line
    return processV1CommsData
  }

  return null
}

const getFileMetadataProcessor = (message) => {
  if (message?.type?.startsWith('uk.gov.fcp.sfd.object.')) {
    return processV2FileMetadata
  }

  if (message.hasOwnProperty(FILE_METADATA)) { // eslint-disable-line
    return processV1FileMetadata
  }

  return null
}

const getProcessor = (message) => {
  const processor = getCommsProcessor(message) || getFileMetadataProcessor(message)

  if (!processor) {
    throw new UnprocessableMessageError('Unsupported message type')
  }

  return processor
}

export { getProcessor }
