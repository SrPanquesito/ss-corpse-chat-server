const {errorsOnValidation} = require('./utils/validationResultChecker');

const userRegister = (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return;

    res.status(201).json({
        message: 'User created successfully!',
        user: {}
    });
};

module.exports = {
    userRegister
};