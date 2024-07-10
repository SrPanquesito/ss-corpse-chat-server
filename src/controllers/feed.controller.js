const getPosts = (req, res, next) => {
    console.log('Feed controller working');
    res.status(200).json({
      posts: [{ title: 'First Post', content: 'This is the first post!' }]
    });
};

const createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    console.log('Feed controller working');
    // Create post in db
    res.status(201).json({
      message: 'Post created successfully!',
      post: { id: new Date().toISOString(), title: title, content: content }
    });
};

module.exports = {
    getPosts,
    createPost
};