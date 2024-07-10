const bcrypt = require('bcrypt');
const {errorsOnValidation} = require('./utils/validationResultChecker');
const Users = require('#models/users.model');

const register = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return;

    try {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 12);
        const profilePictureUrl = req.file ? req.file.path : null;
    
        const user = await Users.create({
            email,
            username,
            password: hashedPassword,
            status: 'ACTIVE',
            profilePictureUrl
        });
        const userId = user.toJSON().id;

        res.status(201).json({
            message: 'User created successfully!',
            userId
        });
    } catch (error) {
        if (error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

module.exports = {
    register
};