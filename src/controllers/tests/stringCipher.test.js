const { encryptText, decryptText } = require('../utils/stringCipher')

describe('stringCipher', () => {
    const originalEnv = process.env

    beforeAll(() => {
        // Set up environment variables for testing
        process.env.CYPHER_KEY =
            '6a2da3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2'
        process.env.CYPHER_IV = '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
    })

    afterAll(() => {
        // Restore original environment variables
        process.env = originalEnv
    })

    test('encryptText should return encrypted text with prefix', () => {
        const text = 'Hello, World!'
        const encryptedText = encryptText(text)
        expect(encryptedText.startsWith('ENC:')).toBe(true)
    })

    test('decryptText should return original text for encrypted text', () => {
        const text = 'Hello, World!'
        const encryptedText = encryptText(text)
        const decryptedText = decryptText(encryptedText)
        expect(decryptedText).toBe(text)
    })

    test('decryptText should return original text for non-encrypted text', () => {
        const text = 'This is not encrypted'
        const decryptedText = decryptText(text)
        expect(decryptedText).toBe(text)
    })
})
