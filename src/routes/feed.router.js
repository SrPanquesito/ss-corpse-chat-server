const router = require('express').Router();
const FeedController = require('#controllers/feed.controller');
const {registerValidator, updateValidator} = require('#routes/validators/feed.validator');

// Get single post
router.get('/post/:postId', FeedController.getPost);

// Get all posts
router.get('/posts', FeedController.getPosts);

// Create single post
router.post('/post', registerValidator, FeedController.createPost);

// Update single post
router.put('/post/:postId', updateValidator, FeedController.updatePost);

// Delete single post
router.delete('/post/:postId', FeedController.deletePost);

module.exports = router;