const { validationResult } = require('express-validator');

const errorsOnValidation = (req, res, next) => {
    const errors = !validationResult(req).isEmpty();

    if (errors) {
        const error = new Error('Unprocessable content. Payload validation failed.');
        error.statusCode = 422;
        error.data = validationResult(req).array();
        next(error);
    }
    return errors
};

module.exports = {errorsOnValidation};