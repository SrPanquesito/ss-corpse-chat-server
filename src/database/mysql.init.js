const sequelize = require('./mysql.configuration');

const initializeSQLConnection = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Turn to true if need to re-create tables
        console.log('Database connection and sync have been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = initializeSQLConnection;