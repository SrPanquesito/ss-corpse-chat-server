const rateLimit = require('express-rate-limit')

jest.mock('express-rate-limit', () => jest.fn())

describe('Rate Limiter Middleware', () => {
    beforeEach(() => {
        rateLimit.mockClear()
    })

    test('should configure rate limiter with correct options', () => {
        require('../ratelimiter.middleware')

        expect(rateLimit).toHaveBeenCalledWith({
            windowMs: 5 * 60 * 1000, // 5 minutes
            max: 200, // Limit each IP to 200 requests per windowMs
            message: 'Too many requests from this IP, please try again later.',
        })
    })
})
