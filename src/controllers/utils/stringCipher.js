const crypto = require('crypto')

const ENCRYPTION_PREFIX = 'ENC:'

function encryptText(text) {
    const key = Buffer.from(process.env.CYPHER_KEY, 'hex')
    const iv = Buffer.from(process.env.CYPHER_IV, 'hex')

    // Create a cipher instance
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

    // Encrypt the message
    let encryptedText = cipher.update(text, 'utf8', 'hex')
    encryptedText += cipher.final('hex')
    return ENCRYPTION_PREFIX + encryptedText
}

function decryptText(text) {
    // Return the text as is if it's not in hexadecimal format
    // This is to prevent decryption of non-encrypted text
    // Check for the encryption prefix
    if (!text.startsWith(ENCRYPTION_PREFIX)) {
        return text // Return the text as is if it doesn't have the prefix
    }

    // Remove the prefix before decryption
    const encryptedText = text.slice(ENCRYPTION_PREFIX.length)

    const key = Buffer.from(process.env.CYPHER_KEY, 'hex')
    const iv = Buffer.from(process.env.CYPHER_IV, 'hex')

    // Create a decipher instance
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

    // Decrypt the message
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8')
    decryptedText += decipher.final('utf8')
    return decryptedText
}

module.exports = {
    encryptText,
    decryptText,
}
