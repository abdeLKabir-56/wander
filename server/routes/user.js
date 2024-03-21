require('dotenv').config();
const express = require('express');
const router = express.Router();
const Post = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const authorLayout ='../views/layouts/author';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;
const  isAuth = require('../middleware/auth');
const fs = require('fs');
const multer = require('multer');
const path = require('path'); 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/Users/info/Desktop/social_media_blog_platform_project/public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


router.get('/user', async (req, res) => {
    
    try{
        const locals ={
            title: 'User',
            content : 'lorem Ipsum  is simply dumm  dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        }    
        res.render('user/index',{locals,user : req.user});
    }
    catch(error){
        console.log(error);
    }
    
});

//Admin - check login

router.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        console.log(user.banned );
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        else if(user.banned === true) {
            res.status(401).json({ message: 'you are banned from the platform' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user._id ,userRole: user.role}, jwtSecret);
        
        //console.log(user.role);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// author - dashboard
router.get('/dashboard', isAuth('user'), async (req, res) => {
    try {
        const locals = {
            title: 'user dashboard',
            content: 'lorem Ipsum is simply dumm dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        };
        const data = await Post.find({ author:  req.user });
        res.render('user/dashboard', { data, locals,layout : authorLayout ,user :  req.cookies.token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/add-post', isAuth('user'), async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            content: 'lorem Ipsum is simply dumm dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        };
        const data = await Post.find({ author: req.userId });

        res.render('user/add-post', { data, locals,layout : authorLayout });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/add-post', isAuth('user'),upload.single('image'), async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
            author: req.userId,
            image: req.file.path
        });
        
        await newPost.save();

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/edit-post/:id', isAuth('user'),async (req, res) => {
    try {
        const locals = {
            title: 'Edit Post',
            content: 'lorem Ipsum is simply dumm dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        };
        const data = await Post.findOne({ _id: req.params.id});
        res.render('admin/edit-post', { data, locals,layout : authorLayout });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/edit-post/:id', isAuth('user'), async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            author: req.userId,
            updatedAt: Date.now(),
            image: req.file.path
            });
            res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/delete-post/:id', isAuth('user'), async (req, res) => {
    try {
        
         await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});


//Admin - register
router.post('/register', async (req, res) => {
    
    try{
        const {username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        try
        {
            const user = await User.create({username,password : hashedPassword,role : 'user'});
            res.redirect('/user');
        }
        catch(err)
        {
            if(err.code ===11000)
            {
                res.status(409).json({message : 'User already in use'});
            }
            res.status(500).json({message : 'Internal server error'});
        }
    }
    catch(error){
        console.log(error);
    }
    
});

//admin logout
router.get('/logout', async (req, res) => {
res.clearCookie('token');
res.redirect('/');

});
//like
router.post('/like', isAuth('user'),async (req, res) => {

    try {
        const postId = req.body.postId;
        const userId = req.userId;
        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $addToSet: { likes: userId } },
            { new: true }
        ).exec();
        res.redirect(`/post/${postId}`);
   } catch (error) {
       console.log(error);
   }
});
//dislike
router.post('/dislike', isAuth('user'),async (req, res) => {

    try {
        const postId = req.body.postId;
        const userId = req.userId;
        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $addToSet: { dislikes: userId } },
            { new: true }
        ).exec();
        res.redirect(`/post/${postId}`);
   } catch (error) {
       console.log(error);
   }
});
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

module.exports =router;