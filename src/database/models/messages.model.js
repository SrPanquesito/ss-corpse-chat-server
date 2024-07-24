const { DataTypes } = require('sequelize');
const sequelize = require('../mysql.configuration');

const Messages = sequelize.define(
  'Messages',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    text: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unseen',
    }
  }
);

module.exports = Messages;