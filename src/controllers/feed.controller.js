const validationResultChecker = require('./utils/validationResultChecker');

const getPosts = (req, res, next) => {
    console.log('Feed controller working');
    res.status(200).json({
        posts: [
            {
                id: 1,
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/maximiliano.png',
                creator: {
                    name: 'Luis'
                }
            }
        ]
    });
};

const createPost = (req, res, next) => {
    validationResultChecker(req, res);
    const title = req.body.title;
    const content = req.body.content;

    console.log('Feed controller working');
    // Create post in db
    res.status(201).json({
      message: 'Post created successfully!',
      post: { id: new Date().toISOString(), title: title, content: content, creator: { name: 'Luis' }, createdAt: new Date() }
    });
};

module.exports = {
    getPosts,
    createPost
};