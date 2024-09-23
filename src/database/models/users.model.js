const { DataTypes } = require('sequelize')
const sequelize = require('../mysql.configuration')

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        // Need to encrypt
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePictureUrl: {
        type: DataTypes.STRING,
    },
    profilePictureThumbnailUrl: {
        type: DataTypes.STRING,
    },
})

module.exports = Users
