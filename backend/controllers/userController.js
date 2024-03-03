const Blog = require('../models/blog');



//display all blgs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        console.log(blogs);
        res.render('blogs', { user: req.user, blogs });
    } catch (err) {
        console.log('Error fetching blogs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
//add blog
const addBlog = async (req, res) => {
    try {
        
        const { title, body,imageUrl } = req.body;
        const author = req.user._id; 
        console.log(author, title, body, imageUrl);
        const newBlog = new Blog({
            title,
            body,
            author,
            imageUrl
        });
        await newBlog.save();
       // res.status(201).json({ message: 'Blog created successfully' });
        res.render('Post', {message: 'Blog created successfully', user: req.user  });
        
    } catch (err) {
        console.log('Error on adding blog function:', err);
        //res.status(500).json({ error: 'Internal server error' });
        res.render('Post', {message: 'Internal server error' , user: req.user });
    }
}
module.exports = {
    addBlog,
    getAllBlogs
}
