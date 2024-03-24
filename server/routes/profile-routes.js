const express = require('express');
const router = express.Router();
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET_KEY;
router.use((req, res, next) => {
  if (!req.user) {
    
    res.redirect('/user'); 
  } else {
    console.log('next() called');
    next();
  }
});

router.get('/', async(req, res) => { 
  const token = jwt.sign({ userId: user._id ,userRole: user.role}, jwtSecret);
  res.cookie('token', token, { httpOnly: true });
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

module.exports = router;
