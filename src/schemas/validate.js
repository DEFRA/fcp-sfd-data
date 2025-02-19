const validate = async (schema, message) => {
  try {
    const value = await schema.validateAsync(message, { abortEarly: false })

    return [value, null]
  } catch (error) {
    const errors = error.details.map((d) => d.message)

    return [null, errors]
  }
}

export {
  validate
}
