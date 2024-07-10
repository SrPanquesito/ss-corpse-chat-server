const { DataTypes } = require('sequelize');
const sequelize = require('../mysql.configuration');

const Posts = sequelize.define(
  'Posts',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    // creator or userId ???
    // image: {
    //   type: DataTypes.BLOB,
    // },
  }
);

module.exports = Posts;