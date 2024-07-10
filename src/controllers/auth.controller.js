const validationResultChecker = require('./utils/validationResultChecker');

const userRegister = (req, res) => {
    validationResultChecker(req, res);

    console.log('User register controller working');
    res.status(201).json({
        message: 'User created successfully!',
        user: {}
    });
};

module.exports = {
    userRegister
};