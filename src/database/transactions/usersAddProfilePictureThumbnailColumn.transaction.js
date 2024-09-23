require('dotenv').config()
const pool = require('../mysql.raw.configuration')

async function execute() {
    const connection = await pool.getConnection()

    try {
        await connection.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
        await connection.beginTransaction()
        await connection.query('LOCK TABLES Users WRITE')

        // Check if the column already exists
        const [rows] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' 
            AND COLUMN_NAME = 'profilePictureThumbnailUrl'
        `)

        if (rows.length === 0) {
            // Add the new column to the Users table
            await connection.query(`
                ALTER TABLE Users
                ADD COLUMN profilePictureThumbnailUrl VARCHAR(255) NULL
            `)
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

module.exports = execute
