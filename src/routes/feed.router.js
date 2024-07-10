const router = require('express').Router();
const {getPosts, createPost} = require('#controllers/feed.controller');

router.get('/posts', getPosts);
router.post('/post', createPost);

module.exports = router;