const { Op } = require('sequelize')
const Users = require('#models/users.model')
const Messages = require('#models/messages.model')
const { decryptText } = require('../utils/stringCipher')
const {
    errorsOnValidation,
} = require('#controllers/utils/validationResultChecker')
const {
    getAllUsersRaw,
    getUserById,
    createMessage,
    getAllMessagesByContactId,
    uploadSingleImageToS3,
} = require('../chat.controller')
const {
    mockResponse,
    dummyRequest,
    dummyUsers,
    dummyUsersFindAndCountAll,
    dummyMessage,
    dummyMessages,
    dummyMessagesFindAndCountAll,
} = require('../../../tests/mock/config.mock')

jest.mock('#models/users.model')
jest.mock('#models/messages.model')
jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/lib-storage')
jest.mock('#clients/aws.s3.client')
jest.mock('../utils/stringCipher')
jest.mock('#controllers/utils/validationResultChecker')

describe('src/controllers/chat.controller.js', () => {
    const mockUserFindAndCountAll = jest.fn()
    const mockUserFindOne = jest.fn()
    const mockMessagesFindOne = jest.fn()
    const mockMessagesFindAndCountAll = jest.fn()
    let mappedUser
    let mappedUserResponse
    let res, req, next

    beforeEach(() => {
        Op.ne = jest.fn()
        Op.or = jest.fn()
        req = dummyRequest
        res = mockResponse()
        next = jest.fn()
        Users.findAndCountAll = mockUserFindAndCountAll.mockResolvedValue(
            dummyUsersFindAndCountAll
        )
        Users.findOne = mockUserFindOne.mockResolvedValue(dummyUsers[0])
        Messages.findOne = mockMessagesFindOne.mockResolvedValue(dummyMessage)
        Messages.update = jest.fn()
        Messages.findAndCountAll =
            mockMessagesFindAndCountAll.mockResolvedValue(
                dummyMessagesFindAndCountAll
            )
        decryptText.mockImplementation((text) => text)
        errorsOnValidation.mockImplementation(() => false)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getAllUsersRaw', () => {
        beforeEach(() => {
            mappedUser = { ...dummyUsers[0] }
            delete mappedUser.password
            delete mappedUser.toJSON
            delete mappedUser.token
            mappedUserResponse = {
                ...mappedUser,
                lastMessage: { ...dummyMessage },
            }
        })

        test('successfull response', async () => {
            await getAllUsersRaw(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(200)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data[0]).toEqual(mappedUserResponse)
        })

        test('successfull response without specified pagination', async () => {
            req = { ...dummyRequest, query: {} }
            await getAllUsersRaw(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(200)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data[0]).toEqual(mappedUserResponse)
        })

        test('successfull response without last message retrieved', async () => {
            mockMessagesFindOne.mockResolvedValue(null)
            mappedUserResponse = { ...mappedUser }

            await getAllUsersRaw(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(200)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data[0]).toEqual(mappedUserResponse)
        })

        test('error with status code 401', async () => {
            const error = new Error('Failed to retrieve all users from DB.')
            error.statusCode = 401
            mockUserFindAndCountAll.mockResolvedValue(null)

            await getAllUsersRaw(req, res, next)

            expect(next).toHaveBeenCalledWith(error)
        })
    })

    describe('getUserById', () => {
        beforeEach(() => {
            mappedUser = { ...dummyUsers[0] }
            mappedUserResponse = {
                ...mappedUser,
                lastMessage: { ...dummyMessage },
            }
        })

        test('successful response with last message', async () => {
            await getUserById(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(200)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data).toEqual(mappedUserResponse)
        })

        test('successfull response without last message retrieved', async () => {
            mockMessagesFindOne.mockResolvedValue(null)
            delete mappedUserResponse.lastMessage

            await getUserById(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(200)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data).toEqual(mappedUserResponse)
        })

        test('error handling', async () => {
            const error = new Error(
                'Failed to retrieve user from DB with userId: id'
            )
            error.statusCode = 401
            mockUserFindOne.mockResolvedValue(null)

            await getUserById(req, res, next)

            expect(next).toHaveBeenCalledWith(error)
        })
    })

    describe('createMessage', () => {
        beforeEach(() => {
            req = dummyRequest
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        test('successfull response', async () => {
            await createMessage(req, res, next)

            const { success, errorMessage } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(201)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
        })

        test('successfull response without imageUrl, upload file to aws', async () => {
            delete req.body.imageUrl

            await createMessage(req, res, next)

            const { success, errorMessage } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(201)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
        })

        test('error validation failed', async () => {
            errorsOnValidation.mockImplementation(() => true)

            await createMessage(req, res, next)

            expect(res.status).not.toHaveBeenCalled()
            expect(res.json).not.toHaveBeenCalled()
            expect(next).not.toHaveBeenCalled()
        })

        test('error on create new message', async () => {
            await createMessage({}, res, next)

            const nextError = next.mock.calls[0][0]

            expect(nextError.message).toContain('Cannot destructure property')
        })
    })

    describe('getAllMessagesByContactId', () => {
        beforeEach(() => {
            req = { ...dummyRequest, params: { contactId: 123 } }
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        test('successfull response', async () => {
            await getAllMessagesByContactId(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(200)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data[0]).toEqual(dummyMessages[0])
        })

        test('successfull response without specified pagination', async () => {
            req = { ...dummyRequest, query: {}, params: { contactId: 123 } }
            await getAllMessagesByContactId(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(200)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data[0]).toEqual(dummyMessages[0])
        })

        test('error on create new message', async () => {
            mockMessagesFindAndCountAll.mockResolvedValue(null)

            await getAllMessagesByContactId(req, res, next)

            const nextError = next.mock.calls[0][0]

            expect(nextError.message).toContain(
                'Failed to retrieve messages from DB.'
            )
        })
    })

    describe('uploadSingleImageToS3', () => {
        beforeEach(() => {
            req = dummyRequest
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        test('successfull response', async () => {
            await uploadSingleImageToS3(req, res, next)

            const { success, errorMessage } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(201)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
        })

        test('successfull response without file, do not upload any file to aws but return empty imageUrl', async () => {
            delete req.file

            await uploadSingleImageToS3(req, res, next)

            const { success, errorMessage, data } = res.json.mock.calls[0][0]

            expect(res.status).toHaveBeenCalledWith(201)
            expect(success).toBeTruthy()
            expect(errorMessage).toBeNull()
            expect(data.imageUrl).toBe('')
        })

        test('error validation failed', async () => {
            errorsOnValidation.mockImplementation(() => true)

            await uploadSingleImageToS3(req, res, next)

            expect(res.status).not.toHaveBeenCalled()
            expect(res.json).not.toHaveBeenCalled()
            expect(next).not.toHaveBeenCalled()
        })

        test('error on create new message', async () => {
            await uploadSingleImageToS3(req, {}, next)

            const nextError = next.mock.calls[0][0]

            expect(nextError.message).toContain('res.status is a function')
        })
    })
})
