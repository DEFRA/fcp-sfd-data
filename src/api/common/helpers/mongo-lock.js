const acquireLock = async (locker, resource, logger) => {
  const lock = await locker.lock(resource)
  if (!lock) {
    if (logger) {
      logger.error(`Failed to acquire lock for ${resource}`)
    }
    return null
  }
  return lock
}

const requireLock = async (locker, resource) => {
  const lock = await locker.lock(resource)
  if (!lock) {
    throw new Error(`Failed to acquire lock for ${resource}`)
  }
  return lock
}

export { acquireLock, requireLock }
