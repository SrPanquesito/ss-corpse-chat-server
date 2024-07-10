const { Sequelize } = require('sequelize');

const username = process.env.MYSQL_USERNAME || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const databaseName = process.env.MYSQL_DBNAME || 'default';

const sequelize = new Sequelize(databaseName, username, password, {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    define: {
        freezeTableName: true,
    }
});

module.exports = sequelize;