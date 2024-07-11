const router = require('express').Router();
const FeedController = require('#controllers/feed.controller');
const {registerValidator, updateValidator} = require('#routes/validators/feed.validator');
const {isAuthenticated} = require('#middleware/authentication.middleware');

// Get single post
router.get('/post/:postId', isAuthenticated, FeedController.getPost);

// Get all posts
router.get('/posts', isAuthenticated, FeedController.getPosts);

// Create single post
router.post('/post', isAuthenticated, registerValidator, FeedController.createPost);

// Update single post
router.put('/post/:postId', isAuthenticated, updateValidator, FeedController.updatePost);

// Delete single post
router.delete('/post/:postId', isAuthenticated, FeedController.deletePost);

module.exports = router;