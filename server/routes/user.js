require('dotenv').config();
const express = require('express');
const router = express.Router();
const Post = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const Categorie = require('../models/categorie');
const authorLayout ='../views/layouts/author';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;
const  isAuth = require('../middleware/auth');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '../public/uploads/');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
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
        const data = await Post.find({ author:  req.userId });
        //console.log(data);
        res.render('user/dashboard', { data, locals,layout : authorLayout ,user :  req.cookies.token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




//user - register
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

//user logout
router.get('/logout', async (req, res) => {
res.clearCookie('token');
res.redirect('/');

});

router.get('/add-post', isAuth('user'), async (req, res) => {
    try {
        const data = await Post.find({ author: req.userId });
        const locals = {
            title: 'Add Post',
            content: 'lorem Ipsum is simply dumm dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        };
        res.render('user/add-post', { data, locals, layout: authorLayout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/add-post', isAuth('user'), upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file' });
        }

        const imageUrl = req.file.filename;
        const { title, body ,categorie} = req.body;
        const author = req.userId;
        const category = new Categorie({
            Description: categorie,
                author: author,
        });
        await category.save();
        const newPost = new Post({
            title,
            body,
            author,
            image: imageUrl,
            categorie: category,
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
        res.render('user/edit-post', { data, locals,layout : authorLayout });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/edit-post/:id', isAuth('user'), async (req, res) => {
    try {
        //console.log(req.file);
        const category = new Categorie({
            Description: categorie,
                author: author,
        });
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            author: req.userId,
            updatedAt: Date.now(),
            image: req.file,
            categorie: category,
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

//signaler
router.post('/signaler', isAuth('user'), async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.body.postId;
        await Post.findByIdAndUpdate(postId, { $set: { signaler: true } });  
        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/*router.put('/visit-counter/:id', async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { count: 1 } },
        { new: true } 
      );
  
      const visitorCount = updatedPost.count;
      if (io) {
        io.emit('visitorCount', { postId, visitorCount });
      } else {
        console.log(`Socket.IO not found. Skipping real-time update for post ${postId}`);
      }
      console.log(`Visitor count for post ${postId} updated to ${visitorCount}`);
     // res.render('post', { post, visitorCount });
    } catch (error) {
      console.error("Error updating visitor count:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });*/



module.exports =router;