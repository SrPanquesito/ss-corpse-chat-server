const router = require('express').Router();
const ChatController = require('#controllers/chat.controller');
const {isAuthenticated} = require('#middleware/authentication.middleware');

// Get all contacts associated with user (Will retrieve all users for now)
router.get('/contacts', isAuthenticated, ChatController.getAllUsersRaw);

module.exports = router;