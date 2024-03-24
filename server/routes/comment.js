require('dotenv').config();
const express = require('express');
const router = express.Router();
const Post = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const authorLayout ='../views/layouts/author';
const isAuth = require('../middleware/auth');


//comment post route
router.post('/post/comments', isAuth('user'), async (req, res) => {
    try {
       const description = req.body.Comment;
       const postId = req.body.postId;
       const author = req.userId;
        const locals = {
            title: 'Post comments',
            content: 'lorem Ipsum is simply dumm dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        };
        const comment = new Comment({
            description : description,
            author : author,
            post: postId
        });
        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $addToSet: { comments: comment } },
            { new: true }
        ).exec();
        await comment.save();
        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//comment like
router.post('/comment/like', isAuth('user'),async (req, res) => {

    try {
        const commentId = req.body.commentId;
        const userId = req.userId;
        const postId = req.body.postId;
        const updatedComment = await Comment.findByIdAndUpdate(commentId,
            { $addToSet: { likes: userId } },
            { new: true }
        ).exec();
        res.redirect(`/post/${postId}`);
   } catch (error) {
       console.log(error);
   }
});
//delete comment
router.delete('/delete-comment/:id', isAuth('user'), async (req, res) => {
    try {
        const postId = req.body.postId;
         await Comment.deleteOne({_id: req.params.id});
         res.redirect(`/post/${postId}`);
    } catch (error) {
        console.log(error);
    }
});


// Render edit comment form
router.get('/edit-comment/:id', isAuth('user'), async (req, res) => {
    try {
        const postId = req.query.postId;
        const commentData = await Comment.findOne({ _id: req.params.id });
        if (!commentData) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.render('edit-comment', { commentData, postId }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update comment
router.put('/edit-comment/:id', isAuth('user'), async (req, res) => {
    try {
        const { description, postId } = req.body;
        const author = req.userId;
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
            description: description,
            author: author,
        }, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router ;