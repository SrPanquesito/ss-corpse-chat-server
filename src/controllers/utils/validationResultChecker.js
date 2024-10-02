const { validationResult } = require('express-validator')

const errorsOnValidation = (req, res, next) => {
    const errors = !validationResult(req).isEmpty()

    if (errors) {
        const error = new Error(
            `Unprocessable payload. ${validationResult(req).array()[0].msg}`
        )
        error.statusCode = 422
        error.data = validationResult(req).array()
        next(error)
    }
    return errors
}

module.exports = { errorsOnValidation }
