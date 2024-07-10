const router = require('express').Router();
const {getPosts, createPost} = require('#controllers/feed.controller');
const registerValidator = require('#validators/register.validator');

router.get('/posts', getPosts);

router.post('/post', registerValidator, createPost);

module.exports = router;