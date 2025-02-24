const validate = async (schema, message) => {
  try {
    const value = await schema.validateAsync(message, { abortEarly: false })

    return [value, null]
  } catch (err) {
    return [null, err]
  }
}

export {
  validate
}
