const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    errorsOnValidation,
} = require('#controllers/utils/validationResultChecker')
const Users = require('#models/users.model')
const { uploadFileToS3 } = require('#clients/aws.s3.client')
const { v4: uuidv4 } = require('uuid')

const register = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return

    try {
        const email = req.body.email
        const username = req.body.username
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 12)

        let s3File
        if (req.file) {
            req.file.originalname = uuidv4() + '_user_' + req.body.username
            s3File = await uploadFileToS3(req.file)
        }
        const user = await Users.create({
            email,
            username,
            password: hashedPassword,
            status: 'ACTIVE',
            profilePictureUrl: s3File?.Location || '',
        })

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username,
                profilePictureUrl: user.profilePictureUrl,
                status: user.status,
            },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        )

        res.status(201).json({
            success: true,
            errorMessage: null,
            data: {
                id: user.id,
                email: user.email,
                token,
            },
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await Users.findOne({ where: { email } })
        if (!user) {
            const error = new Error(
                'A user with this email could not be found.'
            )
            error.statusCode = 401
            throw error
        }

        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            const error = new Error('Wrong password!')
            error.statusCode = 401
            throw error
        }
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username,
                profilePictureUrl: user.profilePictureUrl,
                status: user.status,
            },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        )

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: {
                id: user.id,
                email: user.email,
                token,
            },
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

module.exports = {
    register,
    login,
}
