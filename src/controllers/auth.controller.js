const {errorsOnValidation} = require('./utils/validationResultChecker');

const userRegister = (req, res) => {
    if (errorsOnValidation(req, res)) return;

    res.status(201).json({
        message: 'User created successfully!',
        user: {}
    });
};

module.exports = {
    userRegister
};