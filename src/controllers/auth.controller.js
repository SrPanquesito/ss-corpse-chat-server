const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {errorsOnValidation} = require('#controllers/utils/validationResultChecker');
const Users = require('#models/users.model');
const { uploadFileToS3 } = require('#clients/aws.s3.client');

const register = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return;

    try {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 12);
        const profilePicture = req.file || null;
        const s3File = profilePicture ? await uploadFileToS3(profilePicture) : null;
        const user = await Users.create({
            email,
            username,
            password: hashedPassword,
            status: 'ACTIVE',
            profilePictureUrl: s3File?.Location || ""
        });

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            username: user.username,
            profilePictureUrl: user.profilePictureUrl,
            status: user.status
        }, process.env.JWT_SECRET, { expiresIn: '6h' });

        res.status(201).json({
            success: true,
            errorMessage: null,
            data: {
                id: user.id,
                email: user.email,
                token
            }
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

// Can be used later for faster register process. Will need to poll the user profile picture in the UI.
const registerAsyncUpload = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return;

    try {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 12);
        const profilePicture = req.file || null;
        const user = await Users.create({
            email,
            username,
            password: hashedPassword,
            status: 'ACTIVE',
            profilePictureUrl: ""
        });

        // Upload profile picture to S3 and update user profile picture URL
        if (profilePicture) {
            uploadFileToS3(profilePicture).then(async (s3File) => {
                const updateUser = await Users.findByPk(user.id);
                updateUser.profilePictureUrl = s3File?.Location || "";
                await updateUser.save();
            }).catch(error => {
                if (!error.statusCode) { error.statusCode = 500 };
                console.log("Upload file error. Could not update profilePictureUrl of new user: ", error);
            });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            username: user.username,
            profilePictureUrl: user.profilePictureUrl,
            status: user.status
        }, process.env.JWT_SECRET, { expiresIn: '6h' });

        res.status(201).json({
            success: true,
            errorMessage: null,
            data: {
                id: user.id,
                email: user.email,
                token
            }
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
            email: user.email,
            username: user.username,
            profilePictureUrl: user.profilePictureUrl,
            status: user.status
        }, process.env.JWT_SECRET, { expiresIn: '6h' });

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: {
                id: user.id,
                email: user.email,
                token
            }
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

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: {
                status: user.status
            }
        });
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

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: {
                status: user.status
            }
        });
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