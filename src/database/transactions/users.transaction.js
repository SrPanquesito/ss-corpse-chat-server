// User settings and verification transaction.
// Run this transaction if new users are created manually and need to be enriched with default values.
// One-on-one relation will fill up default values for the user related tables.

require('dotenv').config()
const { Transaction, Op } = require('sequelize')
const initializeSQLConnection = require('../mysql.init')
const sequelize = require('../mysql.configuration')
const Users = require('#models/users.model')
const UserSettings = require('#models/usersettings.model')
const UserVerification = require('#models/userverification.model')

async function execute() {
    // Since it's a small project we can afford to isolate the transaction on the highest isolation level.
    const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    })

    try {
        // Since it's a small project we can afford to lock the tables.
        const usersWithoutSettingsData = await Users.findAll({
            include: [
                {
                    model: UserSettings,
                    as: 'UserSettings',
                    required: false,
                },
            ],
            where: {
                '$UserSettings.userId$': {
                    [Op.is]: null,
                },
            },
            transaction: t,
            lock: true,
        })

        for (const user of usersWithoutSettingsData) {
            await UserSettings.create(
                { userId: user.id },
                { transaction: t, lock: true }
            )
        }

        const usersWithoutVerificationData = await Users.findAll({
            include: [
                {
                    model: UserVerification,
                    as: 'UserVerification',
                    required: false,
                },
            ],
            where: {
                '$UserVerification.userId$': {
                    [Op.is]: null,
                },
            },
            transaction: t,
            lock: true,
        })

        for (const user of usersWithoutVerificationData) {
            await UserVerification.create(
                {
                    verificationMethod: 'email',
                    verificationCode: 'none',
                    isVerified: true,
                    userId: user.id,
                },
                { transaction: t, lock: true }
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
