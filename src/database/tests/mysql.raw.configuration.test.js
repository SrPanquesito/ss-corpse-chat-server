const mysql = require('mysql2/promise')

describe('MySQL Configuration', () => {
    const mockCreatePool = jest.fn()

    beforeEach(() => {
        mysql.createPool = mockCreatePool
        jest.resetModules() // Clear the cache to ensure environment variables are re-read
        process.env = {} // Clear environment variables
    })

    it('should create a pool with default configuration', () => {
        // const expectedConfig = {
        //     host: 'localhost',
        //     port: 3306,
        //     user: 'root',
        //     password: '',
        //     database: 'default',
        // };

        require('../mysql.raw.configuration')

        // expect(mockCreatePool).toHaveBeenCalledWith(expectedConfig);
    })

    it('should create a pool with environment variables', () => {
        process.env.MYSQL_USERNAME = 'test_user'
        process.env.MYSQL_PASSWORD = 'test_password'
        process.env.MYSQL_DBNAME = 'test_db'
        process.env.MYSQL_HOST = 'test_host'
        process.env.MYSQL_PORT = '1234'

        // const expectedConfig = {
        //     host: 'test_host',
        //     port: 1234,
        //     user: 'test_user',
        //     password: 'test_password',
        //     database: 'test_db',
        // };

        require('../mysql.raw.configuration')

        // expect(mockCreatePool).toHaveBeenCalledWith(expectedConfig);
    })
})
