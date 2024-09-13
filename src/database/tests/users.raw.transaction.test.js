const pool = require('../mysql.raw.configuration')
const execute = require('../transactions/users.raw.transaction')

jest.mock('../mysql.raw.configuration', () => ({
    getConnection: jest.fn(),
}))

describe('Users raw MySQL transaction', () => {
    let connection

    beforeEach(() => {
        console.log = jest.fn()
        console.error = jest.fn()
        connection = {
            query: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn(),
        }
        pool.getConnection.mockResolvedValue(connection)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should execute the transaction successfully', async () => {
        connection.query
            .mockResolvedValueOnce() // SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
            .mockResolvedValueOnce() // LOCK TABLES
            .mockResolvedValueOnce([[{ id: 'user1' }]]) // SELECT id FROM Users WHERE id NOT IN (SELECT userId FROM UserSettings)
            .mockResolvedValueOnce([[{ uuid: 'uuid1' }]]) // SELECT UUID() AS uuid
            .mockResolvedValueOnce() // INSERT INTO UserSettings
            .mockResolvedValueOnce([[{ id: 'user2' }]]) // SELECT id FROM Users WHERE id NOT IN (SELECT userId FROM UserVerification)
            .mockResolvedValueOnce([[{ uuid: 'uuid2' }]]) // SELECT UUID() AS uuid
            .mockResolvedValueOnce() // INSERT INTO UserVerification
            .mockResolvedValueOnce() // COMMIT
            .mockResolvedValueOnce() // UNLOCK TABLES

        await execute()

        expect(connection.query).toHaveBeenCalledWith(
            'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE'
        )
        expect(connection.beginTransaction).toHaveBeenCalled()
        expect(connection.query).toHaveBeenCalledWith(
            'LOCK TABLES Users WRITE, UserSettings WRITE, UserVerification WRITE'
        )
        expect(connection.query).toHaveBeenCalledWith(`
            SELECT id FROM Users
            WHERE id NOT IN (SELECT userId FROM UserSettings)
        `)
        expect(connection.query).toHaveBeenCalledWith('SELECT UUID() AS uuid')

        expect(connection.query.mock.calls[4][1]).toEqual(['uuid1', 'user1'])
        expect(connection.query).toHaveBeenCalledWith(`
            SELECT id FROM Users
            WHERE id NOT IN (SELECT userId FROM UserVerification)
        `)
        expect(connection.query).toHaveBeenCalledWith('SELECT UUID() AS uuid')
        expect(connection.query.mock.calls[7][1]).toEqual(['uuid2', 'user2'])
        expect(connection.commit).toHaveBeenCalled()
        expect(connection.query).toHaveBeenCalledWith('UNLOCK TABLES')
        expect(connection.release).toHaveBeenCalled()
    })

    it('should rollback the transaction on error', async () => {
        connection.query
            .mockResolvedValueOnce() // SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
            .mockResolvedValueOnce() // LOCK TABLES
            .mockRejectedValueOnce(new Error('Test error')) // Simulate an error

        await execute()

        expect(connection.query).toHaveBeenCalledWith(
            'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE'
        )
        expect(connection.beginTransaction).toHaveBeenCalled()
        expect(connection.query).toHaveBeenCalledWith(
            'LOCK TABLES Users WRITE, UserSettings WRITE, UserVerification WRITE'
        )
        expect(connection.rollback).toHaveBeenCalled()
        expect(connection.release).toHaveBeenCalled()
    })
})
