const { validationResult } = require('express-validator');

const validationResultChecker = (req, res) => {
    if (!validationResult(req).isEmpty()) {
        const message = 'Validation failed. Request data is incorrect.';
        res.status(422).json({
            message,
            errors: validationResult(req).mapped()
        });
        throw new Error(message);
    }
};

module.exports = validationResultChecker;