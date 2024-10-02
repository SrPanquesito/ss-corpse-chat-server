const router = require('express').Router()
const AuthController = require('#controllers/auth.controller')
const {
    registerValidator,
    loginValidator,
} = require('#validators/auth.validator')

// Register new user account
router.post('/register', registerValidator, AuthController.register)

// Log in user
router.post('/login', loginValidator, AuthController.login)

module.exports = router
