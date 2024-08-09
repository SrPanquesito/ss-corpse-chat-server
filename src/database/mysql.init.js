const Users = require('#models/users.model');
const Messages = require('#models/messages.model');
const sequelize = require('./mysql.configuration');

const associateModels = () => {
    Messages.belongsTo(Users, {foreignKey: 'senderId'});
    Messages.belongsTo(Users, {foreignKey: 'receiverId'});
    Users.hasMany(Messages, {foreignKey: 'senderId'});
    Users.hasMany(Messages, {foreignKey: 'receiverId'});
};

const initializeSQLConnection = async () => {
    try {
        await sequelize.authenticate();
        associateModels();
        await sequelize.sync({ force: false }); // Turn to true if need to re-create tables
        console.log('Database connection and sync have been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = initializeSQLConnection;