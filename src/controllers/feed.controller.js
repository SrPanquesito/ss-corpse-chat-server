const {errorsOnValidation} = require('./utils/validationResultChecker');
const Posts = require('#models/posts.model');

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

const createPost = async (req, res, next) => {
    if (errorsOnValidation(req, res)) return;

    const title = req.body.title;
    const content = req.body.content;
    const post = new Posts({
        title: title,
        content: content,
        imageUrl: 'images/maximiliano.png'
    });

    try {
        // Create post in db
        await post.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: post.toJSON()
        });
    } catch (error) {
        console.log('Error saving post!', error);
    }
};

module.exports = {
    getPosts,
    createPost
};