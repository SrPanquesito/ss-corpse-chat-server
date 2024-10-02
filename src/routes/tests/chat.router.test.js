const express = require('express')
const { isAuthenticated } = require('#middleware/authentication.middleware')
const ChatController = require('#controllers/chat.controller')
const {
    sendMessageValidator,
    uploadImageToS3Validator,
} = require('#validators/chat.validator')

jest.mock('express')
jest.mock('#controllers/chat.controller')

describe('src/routes/chat.router.js', () => {
    const mockGet = jest.fn()
    const mockPost = jest.fn()
    const mockRouter = {
        get: mockGet,
        post: mockPost,
    }

    beforeEach(() => {
        express.Router.mockReturnValue(mockRouter)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('chat routes are defined', () => {
        require('../chat.router')

        // Get
        expect(mockGet.mock.calls[0]).toStrictEqual([
            '/contacts',
            isAuthenticated,
            ChatController.getAllUsersRaw,
        ])
        expect(mockGet.mock.calls[1]).toStrictEqual([
            '/contact',
            isAuthenticated,
            ChatController.getUserById,
        ])
        expect(mockGet.mock.calls[2]).toStrictEqual([
            '/contact/:contactId/messages',
            isAuthenticated,
            ChatController.getAllMessagesByContactId,
        ])

        // Post
        expect(mockPost.mock.calls[0]).toStrictEqual([
            '/send-message',
            isAuthenticated,
            sendMessageValidator,
            ChatController.createMessage,
        ])
        expect(mockPost.mock.calls[1]).toStrictEqual([
            '/upload-single-image',
            isAuthenticated,
            uploadImageToS3Validator,
            ChatController.uploadSingleImageToS3,
        ])
    })
})
