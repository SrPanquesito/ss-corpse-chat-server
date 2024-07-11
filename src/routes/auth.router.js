const router = require('express').Router();
const AuthController = require('#controllers/auth.controller');
const {registerValidator} = require('#validators/auth.validator');

// Register new user account
router.post('/register', registerValidator, AuthController.register);

// Login user
router.post('/login', AuthController.login);

module.exports = router;