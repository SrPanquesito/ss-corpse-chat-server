require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const sequelize = require('./src/database/mysql.configuration');
const {corsOptions} = require('./src/routes/middleware/cors.middleware');
const authRouter = require('#routes/auth.router');

// Environment setup
const PORT = process.env.PORT || 3000;

const dbConnectAndSync = async () => {
    try {
        await sequelize.authenticate()
        console.log('Database connection has been established successfully.');

        await sequelize.sync(
            { force: false } // Turn to true if need to re-create tables
        );
        console.log('Database tables have been synched successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Cross-Origin Request Sharing (CORS)
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRouter);
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbConnectAndSync();
});