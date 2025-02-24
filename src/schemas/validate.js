const validate = async (schema, message) => {
  try {
    const value = await schema.validateAsync(message, { abortEarly: false })

    return [value, null]
  } catch (error) {
    return [null, error]
  }
}

export {
  validate
}
