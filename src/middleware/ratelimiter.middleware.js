const rateLimit = require('express-rate-limit')

// https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 300, // Limit each IP to 300 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
})

module.exports = { limiter }
