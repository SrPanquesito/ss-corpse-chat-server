const { Op } = require('sequelize');
const Users = require('#models/users.model');
const Messages = require('#models/messages.model');
const { uploadFileToS3 } = require('#clients/aws.s3.client');

const getAllUsersRaw = async (req, res, next) => {
    try {
        const loggedUserId = req.userId;
        const users = await Users.findAll({
            where: {
                id: {
                    [Op.ne]: loggedUserId
                }
            }
        });
        if (!users) {
            const error = new Error('Failed to retrieve all users from DB.');
            error.statusCode = 401;
            throw error;
        }

        let mappedUsers = users.map(user => {
            const userJson = user.toJSON();
            return {
                id: userJson.id,
                username: userJson.username,
                email: userJson.email,
                profilePictureUrl: userJson.profilePictureUrl,
                status: userJson.status
            };
        });

        for (let i = 0; i < mappedUsers.length; i++) {
            const lastMessage = await getLastMessage(loggedUserId, mappedUsers[i].id);
            if (lastMessage) {
                mappedUsers[i].lastMessage = lastMessage.toJSON();
            }
        }

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: mappedUsers
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const getLastMessage = async (userId, contactId) => {
    return await Messages.findOne({
        where: {
            [Op.or]: [
                { senderId: userId, receiverId: contactId },
                { senderId: contactId, receiverId: userId }
            ]
        },
        order: [
            ['createdAt', 'DESC'],
        ]
    });
};

const createMessage = async(req, res, next) => {
    try {
        const { sender, receiver, message } = req.body;
        let imageUrl = req.body.imageUrl || "";

        if (!imageUrl && req.file) {
            const file = req.file;
            const s3File = await uploadFileToS3(file);
            imageUrl = s3File?.Location || "";
        }

        const createdMessage = new Messages({
            text: message,
            senderId: sender.id,
            receiverId: receiver.id,
            imageUrl,
        });

        await createdMessage.save();

        res.status(201).json({
            success: true,
            errorMessage: null,
            data: {
                message: createdMessage.toJSON()
            }
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const getAllMessagesByContactId = async (req, res, next) => {
    try {
        const loggedUserId = req.userId;
        const contactId = req.params.contactId;

        await Messages.update(
            { status: 'seen' },
            { where: {
                [Op.or]: [
                    { senderId: loggedUserId, receiverId: contactId },
                    { senderId: contactId, receiverId: loggedUserId }
                ],
            }}
        );
        const messages = await Messages.findAll({ 
            where: {
                [Op.or]: [
                    { senderId: loggedUserId, receiverId: contactId },
                    { senderId: contactId, receiverId: loggedUserId }
                ],
            },
            order: [
                ['createdAt', 'DESC'],
            ]
        });
        if (!messages) {
            const error = new Error('Failed to retrieve messages from DB.');
            error.statusCode = 401;
            throw error;
        }

        let mappedData = messages.map(msg => {
            return msg.toJSON();
        });

        res.status(200).json({
            success: true,
            errorMessage: null,
            data: mappedData
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const uploadSingleImageToS3 = async(req, res, next) => {
    try {
        const file = req.file || null;
        const s3File = file ? await uploadFileToS3(file) : null;
        const imageUrl = s3File?.Location || "";

        res.status(201).json({
            success: true,
            errorMessage: null,
            data: {
                imageUrl
            }
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

module.exports = {
    getAllUsersRaw,
    createMessage,
    getAllMessagesByContactId,
    uploadSingleImageToS3
};