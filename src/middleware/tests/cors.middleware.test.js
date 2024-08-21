describe('src/middleware/cors.middleware.js', () => {
    let originalEnv

    afterAll(() => {
        // Restore the original environment variables
        process.env = originalEnv
    })

    beforeAll(() => {
        // Save the original environment variables
        originalEnv = process.env
    })

    afterEach(() => {
        // Clear the require cache to reset the module state
        jest.resetModules()
    })

    test('corsOptions is defined', () => {
        process.env = { ...originalEnv }
        const { corsOptions } = require('../cors.middleware')
        expect(corsOptions).toBeDefined()
    })

    test('should log an error and use an empty allowlist if ALLOW_LIST is invalid JSON', () => {
        console.error = jest.fn() // Mock console.error
        process.env = { ...originalEnv, ALLOW_LIST: 'invalid-json' }
        const { corsOptions } = require('../cors.middleware')
        expect(console.error).toHaveBeenCalledWith(
            'Failed to parse ALLOW_LIST:',
            expect.any(SyntaxError)
        )
        expect(corsOptions.origin).toEqual([])
    })
})
