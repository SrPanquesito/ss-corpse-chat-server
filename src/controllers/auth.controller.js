const { validationResult } = require('express-validator');

const validInput = (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({
            errors: validationResult(req).mapped()
        });
    }
};

const userRegister = (req, res) => {
    validInput(req, res);

    console.log('User register controller working');
}

module.exports = {
    userRegister
};