const express = require('express');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Post = require('../models/blog');
const jwtSecret = process.env.JWT_SECRET_KEY;
const User = require('../models/user');
const authorLayout ='../views/layouts/author';
router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/user'); 
  } else {
    console.log('next() called');
    next();
  }
});

router.get('/', async (req, res) => {
  try {
    const token = jwt.sign({ userId: req.user._id, userRole: req.user.role }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    const locals = {
      title: 'user dashboard',
      content: 'lorem Ipsum is simply dumm dolor Lorem Ipsum is simply ipsum. Lorem Ips'
    };
    const data = await Post.find({ author: req.user._id });
    res.render('user/dashboard', { data, locals, layout: authorLayout, user: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'user/ dash :Internal server error' });
  }
});



module.exports = router;
