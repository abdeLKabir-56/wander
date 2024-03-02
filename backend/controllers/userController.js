const Blog = require('../models/blog');




//add blog
const addBlog = async (req, res) => {
    try {
        
        const { title, body,imageUrl } = req.body;
        const author = req.user._id; 
        const newBlog = new Blog({
            title,
            body,
            author,
            imageUrl
        });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully' });

        
    } catch (err) {
        console.log('Error on adding blog function:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {
    addBlog
}
