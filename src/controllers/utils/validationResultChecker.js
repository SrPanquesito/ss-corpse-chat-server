const { validationResult } = require('express-validator');

const errorsOnValidation = (req, res, next) => {
    const errors = !validationResult(req).isEmpty();

    if (errors) {
        const error = new Error('Validation failed. Request data is incorrect.');
        error.statusCode = 422;
        error.data = validationResult(req).mapped();
        next(error);
    }
    return errors
};

module.exports = {errorsOnValidation};