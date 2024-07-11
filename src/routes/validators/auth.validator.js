const { body } = require('express-validator');
const Users = require('#models/users.model');

const registerValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom(async (email, {req}) => {
            return await Users.findOne({ where: { email } }).then(user => {
                if (user) {
                    return Promise.reject('E-mail address already in use.');
                }
            });
        })
        .normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('username').trim().not().isEmpty(),
];

const updateStatusValidator = [
    body('status').trim().not().isEmpty()
];

module.exports = {
    registerValidator,
    updateStatusValidator
}; 