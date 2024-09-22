// Messages Transaction: Add Thumbnail Column
// Run this transaction to delete previous Messages table and re-create the same table but with more columns.
// NOTE: Dump table before running this transaction.

require('dotenv').config()
const { Transaction, DataTypes } = require('sequelize')
const initializeSQLConnection = require('../mysql.init')
const sequelize = require('../mysql.configuration')
const Messages = require('#models/messages.model')

async function execute() {
    // Since it's a small project we can afford to isolate the transaction on the highest isolation level.
    const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    })

    try {
        // Since it's a small project we can afford to lock the tables.
        const allMessages = await Messages.findAll({
            transaction: t,
            lock: true,
        })

        if (allMessages.length > 0) {
            // Drop the Messages table if it exists
            // await sequelize.queryInterface.dropTable('Messages', { transaction: t });

            const tableDescription =
                await sequelize.queryInterface.describeTable('Messages', {
                    transaction: t,
                })
            if (!tableDescription.thumbnailUrl) {
                // Add column to the Messages table
                await sequelize.queryInterface.addColumn(
                    'Messages',
                    'thumbnailUrl',
                    {
                        type: DataTypes.STRING,
                        allowNull: true,
                    },
                    { transaction: t }
                )
            }

            await Messages.destroy({
                truncate: true,
                transaction: t,
                lock: true,
            })

            const messagesData = allMessages.map((message) => ({
                id: message.id,
                text: message.text,
                imageUrl: message.imageUrl,
                thumbnailUrl: message.thumbnailUrl || '',
                status: message.status,
                senderId: message.senderId,
                receiverId: message.receiverId,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            }))

            await sequelize.queryInterface.bulkInsert(
                'Messages',
                messagesData,
                { transaction: t }
            )
        }

        await t.commit()
    } catch (error) {
        console.error(error)
        await t.rollback()
    }
}

try {
    initializeSQLConnection()
    execute()
} catch (error) {
    // istanbul ignore next
    console.error('Error occurred:', error)
}

module.exports = execute
