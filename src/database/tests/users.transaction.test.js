const { Op } = require('sequelize')
const initializeSQLConnection = require('../mysql.init')
const sequelize = require('../mysql.configuration')
const Users = require('#models/users.model')
const UserSettings = require('#models/usersettings.model')
const UserVerification = require('#models/userverification.model')
const execute = require('../transactions/users.transaction')

jest.mock('../mysql.init')
jest.mock('#models/usersettings.model')
jest.mock('#models/userverification.model')

describe('execute', () => {
    let transaction
    let mockUsersFindAll = jest.fn()
    let mockTransaction = jest.fn()

    beforeEach(() => {
        transaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        }
        console.error = jest.fn()

        sequelize.transaction = mockTransaction
        initializeSQLConnection.mockImplementation(() => {})

        Users.findAll = mockUsersFindAll
        UserSettings.create = jest.fn()
        UserVerification.create = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should commit the transaction successfully', async () => {
        mockTransaction.mockResolvedValue(transaction)
        mockUsersFindAll
            .mockResolvedValueOnce([{ id: 1 }]) // Mock users without settings
            .mockResolvedValueOnce([{ id: 2 }]) // Mock users without verification

        await execute()

        expect(mockUsersFindAll).toHaveBeenCalledWith({
            include: [
                { model: UserSettings, as: 'UserSettings', required: false },
            ],
            where: { '$UserSettings.userId$': { [Op.is]: null } },
            transaction,
            lock: true,
        })

        expect(UserSettings.create).toHaveBeenCalledWith(
            { userId: 1 },
            { transaction, lock: true }
        )

        expect(mockUsersFindAll).toHaveBeenCalledWith({
            include: [
                {
                    model: UserVerification,
                    as: 'UserVerification',
                    required: false,
                },
            ],
            where: { '$UserVerification.userId$': { [Op.is]: null } },
            transaction,
            lock: true,
        })

        expect(UserVerification.create).toHaveBeenCalledWith(
            {
                verificationMethod: 'email',
                verificationCode: 'none',
                isVerified: true,
                userId: 2,
            },
            { transaction, lock: true }
        )

        expect(transaction.commit).toHaveBeenCalled()
    })

    it('should rollback the transaction on error', async () => {
        mockTransaction.mockResolvedValue(transaction)
        mockUsersFindAll.mockRejectedValueOnce(new Error('Test error'))

        await execute()

        expect(transaction.rollback).toHaveBeenCalled()
    })

    it.skip('should throw error', async () => {
        mockTransaction.mockImplementation(() => {
            throw new Error('Test error')
        })

        await expect(await execute()).rejects.toMatch('Test error')
    })
})
