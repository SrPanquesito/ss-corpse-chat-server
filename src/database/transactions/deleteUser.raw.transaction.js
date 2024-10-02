require('dotenv').config()
const pool = require('../mysql.raw.configuration')

async function execute(userId) {
    const connection = await pool.getConnection()

    try {
        await connection.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
        await connection.beginTransaction()
        await connection.query(
            'LOCK TABLES Users WRITE, UserSettings WRITE, UserVerification WRITE'
        )

        // Call the stored procedure
        await connection.query('CALL DeleteUserById(?)', [userId])

        await connection.commit()
        await connection.query('UNLOCK TABLES')
    } catch (error) {
        console.error('Transaction error:', error)
        await connection.rollback()
    } finally {
        // Release the connection
        connection.release()
        process.exit()
    }
}

// Enter UUID here
execute('d69c9c9b-257d-4f12-9ede-40a78fa4686a')

/*
-- MySQL Stored Procedure

DELIMITER //
CREATE PROCEDURE DeleteUserById(IN inputUserId VARCHAR(255))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback the transaction in case of an error
        ROLLBACK;
    END;
    -- Start a new transaction
    START TRANSACTION;
    -- Delete from UserVerification
    DELETE FROM UserVerification WHERE userId = inputUserId;
    -- Delete from UserSettings
    DELETE FROM UserSettings WHERE userId = inputUserId;
    -- Delete from Users
    DELETE FROM Users WHERE id = userId;
    -- Commit the transactiona
    COMMIT;
END //
DELIMITER ;

*/
