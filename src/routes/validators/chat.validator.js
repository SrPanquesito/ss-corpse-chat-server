const { body } = require('express-validator')
const Users = require('#models/users.model')

const sendMessageValidator = [
    body('sender').custom(
        /* istanbul ignore next */
        async (sender) => {
            if (!sender) return Promise.reject('Sender not defined.')
            if (!sender.id) return Promise.reject('Sender ID not defined.')

            return await Users.findOne({ where: { id: sender.id } }).then(
                (user) => {
                    if (!user) {
                        return Promise.reject('Sender not found.')
                    }
                }
            )
        }
    ),
    body('receiver').custom(
        /* istanbul ignore next */
        async (receiver) => {
            if (!receiver) return Promise.reject('Receiver not defined.')
            if (!receiver.id) return Promise.reject('Receiver ID not defined.')

            return await Users.findOne({ where: { id: receiver.id } }).then(
                (user) => {
                    if (!user) {
                        return Promise.reject('Receiver not found.')
                    }
                }
            )
        }
    ),
]

// Express validator does not support file validation, validate file in multer configuration.
const uploadImageToS3Validator = [
    body('username')
        .trim()
        .not()
        .isEmpty()
        .custom(
            /* istanbul ignore next */
            async (username) => {
                return await Users.findOne({ where: { username } }).then(
                    (user) => {
                        if (!user) {
                            return Promise.reject(`User ${username} not found.`)
                        }
                    }
                )
            }
        ),
]

module.exports = {
    sendMessageValidator,
    uploadImageToS3Validator,
}
