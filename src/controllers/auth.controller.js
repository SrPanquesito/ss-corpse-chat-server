const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '6h' });

        res.status(201).json({
            message: 'User created successfully!',
            token,
            userId: user.id
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '6h' });

        res.status(200).json({
            message: 'User logged in successfully!',
            token,
            userId: user.id
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const getUserStatus = async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.userId);
        if (!user) {
            const error = new Error('User was not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({status: user.status});
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const updateUserStatus = async (req, res, next) => {
    try {
        const newStatus = req.body.status;
        const user = await Users.findByPk(req.userId);
        if (!user) {
            const error = new Error('User was not found.');
            error.statusCode = 404;
            throw error;
        }
        user.status = newStatus;
        await user.save();

        res.status(200).json({status: user.status});
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

module.exports = {
    register,
    login,
    getUserStatus,
    updateUserStatus
};