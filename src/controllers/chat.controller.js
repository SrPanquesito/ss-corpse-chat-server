const { Op } = require('sequelize')
const Users = require('#models/users.model')
const Messages = require('#models/messages.model')
const { uploadFileToS3 } = require('#clients/aws.s3.client')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const { encryptText, decryptText } = require('./utils/stringCipher')
const {
    errorsOnValidation,
} = require('#controllers/utils/validationResultChecker')

const getAllUsersRaw = async (req, res, next) => {
    try {
        const loggedUserId = req.userId

        // Extract pagination parameters from query
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize

        const users = await Users.findAndCountAll({
            where: {
                id: {
                    [Op.ne]: loggedUserId,
                },
            },
            order: [
                ['createdAt', 'DESC'],
                ['id', 'DESC'],
            ],
            limit: pageSize,
            offset,
        })
        if (!users) {
            const error = new Error('Failed to retrieve all users from DB.')
            error.statusCode = 401
            throw error
        }

        // Ensure unique users only
        const mappedUsersSet = new Set()

        users.rows.forEach((user) => {
            const userJson = user.toJSON()
            mappedUsersSet.add({
                id: userJson.id,
                username: userJson.username,
                email: userJson.email,
                profilePictureUrl: userJson.profilePictureUrl,
                profilePictureThumbnailUrl: userJson.profilePictureThumbnailUrl,
                status: userJson.status,
            })
        })

        const mappedUsers = Array.from(mappedUsersSet)

        for (let i = 0; i < mappedUsers.length; i++) {
            const lastMessage = await getLastMessage(
                loggedUserId,
                mappedUsers[i].id
            )
            if (lastMessage) {
                mappedUsers[i].lastMessage = lastMessage.toJSON()
            }
        }

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: mappedUsers,
            pagination: {
                totalItems: users.count,
                totalPages: Math.ceil(users.count / pageSize),
                currentPage: page,
                pageSize: pageSize,
            },
        })
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const loggedUserId = req.userId
        const userId = req.query.id

        const user = await Users.findOne({
            where: {
                id: {
                    [Op.eq]: userId,
                },
            },
        })
        if (!user) {
            const error = new Error(
                `Failed to retrieve user from DB with userId: ${userId}`
            )
            error.statusCode = 401
            throw error
        }

        const userJson = user.toJSON()

        const lastMessage = await getLastMessage(loggedUserId, userJson.id)
        if (lastMessage) {
            userJson.lastMessage = lastMessage.toJSON()
        }

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: userJson,
        })
    } catch (error) {
        next(error)
    }
}

const getLastMessage = async (userId, contactId) => {
    const lastMessage = await Messages.findOne({
        where: {
            [Op.or]: [
                { senderId: userId, receiverId: contactId },
                { senderId: contactId, receiverId: userId },
            ],
        },
        order: [['createdAt', 'DESC']],
    })
    if (lastMessage) {
        lastMessage.text = decryptText(lastMessage.text)
    }
    return lastMessage
}

const createMessage = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return

    try {
        let { sender, receiver, message } = req.body
        let imageUrl = req.body.imageUrl || ''

        // Fallback code. It should only trigger if UI fails to upload image in separate request.
        if (!imageUrl && req.file) {
            const fileExtension = path.extname(req.file.originalname) // Extract the file extension
            req.file.originalname =
                sender.username + '_message_' + uuidv4() + fileExtension
            const s3File = await uploadFileToS3(req.file)
            imageUrl = s3File?.Location || ''
        }

        const encryptedText = encryptText(message)

        const createdMessage = new Messages({
            text: encryptedText,
            senderId: sender.id,
            receiverId: receiver.id,
            imageUrl,
        })

        await createdMessage.save()

        res.status(201).json({
            success: true,
            errorMessage: null,
            data: {
                message: createdMessage.toJSON(),
            },
        })
    } catch (error) {
        next(error)
    }
}

const getAllMessagesByContactId = async (req, res, next) => {
    try {
        const loggedUserId = req.userId
        const contactId = req.params.contactId

        // Extract pagination parameters from query
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize

        await Messages.update(
            { status: 'seen' },
            {
                where: {
                    [Op.or]: [
                        { senderId: loggedUserId, receiverId: contactId },
                        { senderId: contactId, receiverId: loggedUserId },
                    ],
                },
            }
        )
        const messages = await Messages.findAndCountAll({
            where: {
                [Op.or]: [
                    { senderId: loggedUserId, receiverId: contactId },
                    { senderId: contactId, receiverId: loggedUserId },
                ],
            },
            order: [
                ['createdAt', 'DESC'],
                ['id', 'DESC'],
            ],
            limit: pageSize,
            offset,
        })
        if (!messages) {
            const error = new Error('Failed to retrieve messages from DB.')
            error.statusCode = 401
            throw error
        }

        let mappedData = messages.rows.map((msg) => {
            msg.text = decryptText(msg.text)
            return msg.toJSON()
        })

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: mappedData,
            pagination: {
                totalItems: messages.count,
                totalPages: Math.ceil(messages.count / pageSize),
                currentPage: page,
                pageSize: pageSize,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Messages single image uploader to S3
const uploadSingleImageToS3 = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return

    try {
        const username = req.body.username
        let s3File
        if (req.file && username) {
            const fileExtension = path.extname(req.file.originalname) // Extract the file extension
            req.file.originalname =
                username + '_message_' + uuidv4() + fileExtension
            s3File = await uploadFileToS3(req.file)
        }

        res.status(201).json({
            success: true,
            errorMessage: null,
            data: {
                imageUrl: s3File?.Location || '',
            },
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUsersRaw,
    getUserById,
    createMessage,
    getAllMessagesByContactId,
    uploadSingleImageToS3,
}
