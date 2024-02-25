require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const {corsOptions} = require('./src/middleware/cors.middleware');
const authRouter = require('#routes/auth.router');

// Environment setup
const PORT = process.env.PORT || 3000;

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
});