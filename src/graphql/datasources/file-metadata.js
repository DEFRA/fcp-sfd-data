import { getMetadataByProperty } from '../../repos/file-metadata.js'
import enumMap from '../schema/file-metadata/enum-map.js'

export class FileMetadata {
  constructor (request) {
    this.request = request
  }

  async getByProperty (key, value) {
    const mappedKey = enumMap[key]
    return getMetadataByProperty(mappedKey, value)
  }
}
