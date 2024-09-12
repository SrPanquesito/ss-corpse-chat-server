const { DataTypes } = require('sequelize')
const sequelize = require('../mysql.configuration')

const UserVerification = sequelize.define('UserVerification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    verificationMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    verificationCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
})

module.exports = UserVerification
