const router = require('express').Router();
const ChatController = require('#controllers/chat.controller');
const {isAuthenticated} = require('#middleware/authentication.middleware');

// Get all contacts associated with user (Will retrieve all users for now)
router.get('/contacts', isAuthenticated, ChatController.getAllUsersRaw);

router.post('/send-message', isAuthenticated, ChatController.createMessage);

router.get('/contact/:contactId/messages', isAuthenticated, ChatController.getAllMessagesByContactId);

router.post('/upload-single-image', isAuthenticated, ChatController.uploadSingleImageToS3);

module.exports = router;