const router = require('express').Router();
const AuthController = require('#controllers/auth.controller');
const {registerValidator, updateStatusValidator} = require('#validators/auth.validator');
const {isAuthenticated} = require('#middleware/authentication.middleware');

// Register new user account
router.post('/register', registerValidator, AuthController.register);

// Log in user
router.post('/login', AuthController.login);

// Get user status
router.post('/status', isAuthenticated, AuthController.getUserStatus);

// Update user status
router.patch('/status', isAuthenticated, updateStatusValidator, AuthController.updateUserStatus);

module.exports = router;