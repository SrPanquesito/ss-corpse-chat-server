const { body } = require('express-validator');

const baseValidator = [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
];

module.exports = {
    registerValidator: baseValidator,
    updateValidator: baseValidator
}; 