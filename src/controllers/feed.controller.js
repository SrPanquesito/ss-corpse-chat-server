const {errorsOnValidation} = require('./utils/validationResultChecker');
const Posts = require('#models/posts.model');

const getPost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Posts.findByPk(postId);
        if (!post) {
            const error = new Error('Post not found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Fetched single post successfully.',
            post: post.toJSON()
        });
    } catch (error) {
        if (error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const getPosts = async (req, res, next) => {
    try {
        const posts = await Posts.findAll();
        if (!posts) {
            const error = new Error('Posts not found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Fetched all posts successfully.',
            posts: posts.toJSON()
        });
    } catch (error) {
        if (error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const createPost = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return;

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
        if (error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

module.exports = {
    getPost,
    getPosts,
    createPost
};