const { DataTypes } = require('sequelize')
const sequelize = require('../mysql.configuration')

const UserSettings = sequelize.define('UserSettings', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    isDarkmode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isReported: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
})

module.exports = UserSettings
