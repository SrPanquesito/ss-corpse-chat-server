const { validationResult } = require('express-validator');

const errorsOnValidation = (req, res) => {
    const errors = !validationResult(req).isEmpty();

    if (errors) {
        res.status(422).json({
            message: 'Validation failed. Request data is incorrect.',
            errors: validationResult(req).mapped()
        });
    }
    return errors
};

module.exports = {errorsOnValidation};