const {errorsOnValidation} = require('./utils/validationResultChecker');
const Posts = require('#models/posts.model');
const {clearImage} = require('#utils/image.util');

const getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
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
        const currentPage = req.query.page || 1;
        const perPage = req.query.offset || 3;
        const totalItems = await Posts.count();
        let posts = [];

        if (totalItems > 0) {
            posts = await Posts.findAll({
                offset: (currentPage - 1) * perPage,
                limit: perPage
            });
            if (!posts) {
                const error = new Error('Posts not found!');
                error.statusCode = 404;
                throw error;
            }
        }

        res.status(200).json({
            message: 'Fetched posts successfully 😃/',
            posts,
            totalItems
        });
    } catch (error) {
        if (error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const createPost = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return;

    try {
        if (!req.file) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
    
        const title = req.body.title;
        const content = req.body.content;
        const imageUrl = req.file.path;
        const post = new Posts({
            title: title,
            content: content,
            imageUrl
        });

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


const updatePost = async (req, res, next) => {
    if (errorsOnValidation(req, res, next)) return;

    try {
        const postId = req.params.postId;
        const title = req.body.title;
        const content = req.body.content;
        let imageUrl = req.body.imageUrl;
        imageUrl = req.file ? req.file.path : imageUrl;
        if (!imageUrl) throw new Error('No image provided.');

        // Get post from db
        const post = await Posts.findByPk(postId);
        if (!post) throw new Error('Post not found!');

        if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        // Save changes to db
        await post.save();

        res.status(201).json({
            message: 'Post updated successfully!',
            post: post.toJSON()
        });
    } catch (error) {
        if (error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        // Get post from db
        const post = await Posts.findByPk(postId);
        if (!post) throw new Error('Post not found!');
        clearImage(post.imageUrl);

        // Delete record from db
        await post.destroy();

        res.status(201).json({
            message: 'Post deleted successfully!',
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
    createPost,
    updatePost,
    deletePost
};