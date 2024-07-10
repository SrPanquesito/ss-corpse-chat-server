require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const initializeSQLConnection = require('#database/mysql.init');
const {corsOptions} = require('#middleware/cors.middleware');
const authRouter = require('#routes/auth.router');
const postRouter = require('#routes/post.router');
const app = express();

// Environment setup
const PORT = process.env.PORT || 3000;

// Parse incoming requests as application/json
app.use(bodyParser.json());

// Cross-Origin Request Sharing (CORS)
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/feed', postRouter);
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initializeSQLConnection();
});