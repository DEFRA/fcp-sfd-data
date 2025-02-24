export default class UnprocessableMessageError extends Error {
  constructor (message, options = {}) {
    super(message, options)
  }
}
