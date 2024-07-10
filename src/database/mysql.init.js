const Users = require('#models/users.model');
const Posts = require('#models/posts.model');
const sequelize = require('./mysql.configuration');

const associateModels = () => {
    Posts.belongsTo(Users, { foreignKey: 'userId' });
    Users.hasMany(Posts, { foreignKey: 'userId' });
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