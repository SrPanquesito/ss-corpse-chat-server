const { DataTypes } = require('sequelize')
const sequelize = require('../mysql.configuration')

const Messages = sequelize.define('Messages', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    text: {
        // Need to encrypt
        type: DataTypes.STRING,
        defaultValue: '',
    },
    imageUrl: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unseen',
    },
    thumbnailUrl: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true,
    },
})

module.exports = Messages
