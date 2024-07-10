const router = require('express').Router();
const FeedController = require('#controllers/feed.controller');
const registerValidator = require('#validators/register.validator');

router.get('/posts', FeedController.getPosts);
router.get('/post', FeedController.getPost);
router.post('/post', registerValidator, FeedController.createPost);

module.exports = router;