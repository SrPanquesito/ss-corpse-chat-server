require('dotenv').config()
const pool = require('../mysql.raw.configuration')

async function execute() {
    const connection = await pool.getConnection()

    try {
        await connection.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
        await connection.beginTransaction()
        await connection.query(
            'LOCK TABLES Users WRITE, UserSettings WRITE, UserVerification WRITE'
        )

        // Actual logic
        const [usersWithoutSettings] = await connection.query(`
            SELECT id FROM Users
            WHERE id NOT IN (SELECT userId FROM UserSettings)
        `)

        // Insert default values except FK
        for (const user of usersWithoutSettings) {
            const [result] = await connection.query('SELECT UUID() AS uuid')
            const uuid = result[0].uuid

            await connection.query(
                `
                INSERT INTO UserSettings (id, userId, createdAt, updatedAt) 
                VALUES (?, ?, NOW(), NOW())
            `,
                [uuid, user.id]
            )
        }

        const [usersWithoutVerification] = await connection.query(`
            SELECT id FROM Users
            WHERE id NOT IN (SELECT userId FROM UserVerification)
        `)

        // Insert default values for those users
        for (const user of usersWithoutVerification) {
            const [result] = await connection.query('SELECT UUID() AS uuid')
            const uuid = result[0].uuid

            await connection.query(
                `
                INSERT INTO UserVerification (id, userId, verificationMethod, verificationCode, isVerified, createdAt, updatedAt)
                VALUES (?, ?, 'email', 'none', true, NOW(), NOW())
            `,
                [uuid, user.id]
            )
        }

        await connection.commit()

        // We need to manually unlock the tables
        await connection.query('UNLOCK TABLES')
    } catch (error) {
        console.error('Transaction error:', error)
        await connection.rollback()
    } finally {
        // Release the connection
        connection.release()
    }
}

execute().catch((error) => {
    console.error('Error occurred:', error)
})
