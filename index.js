require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const initializeSQLConnection = require('#database/mysql.init');
const {corsOptions} = require('#middleware/cors.middleware');
const authRouter = require('#routes/auth.router');
const chatRouter = require('#routes/chat.router');
const feedRouter = require('#routes/feed.router');
const errorHandler = require('#utils/errorHandler');
const { multerMemorySingleFile } = require('#config/multer.configuration');
const app = express();

// Environment setup
const PORT = process.env.PORT || 3000;

// Cross-Origin Request Sharing (CORS)
app.use(cors(corsOptions));

// Parse incoming requests as application/json
app.use(bodyParser.json());
app.use(multerMemorySingleFile);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/feed', feedRouter);
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initializeSQLConnection();
});