
require('dotenv').config();
const express = require('express');
const router = express.Router();
const Post = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const adminLayout ='../views/layouts/admin';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;
const isAuth = require('../middleware/auth');
//const isAdmin = require('../middleware/isAdmin');
router.get('/admin', async (req, res) => {
    
    try{
        const locals ={
            title: 'Admin',
            content : 'lorem Ipsum  is simply dumm  dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        }    
        res.render('admin/index',{locals,user : req.user});
    }
    catch(error){
        console.log(error);
    }
    
});


router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
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
        res.redirect('/admin_dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Admin - register
router.post('/register_admin', async (req, res) => {
    
    try{
        const {username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        try
        {
            const user = await User.create({username,password : hashedPassword, role : 'admin'});
            res.redirect('/admin');
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

router.get('/admin_dashboard', isAuth('admin'), async (req, res) => {
    try {
        const locals = {
            title: 'Admin Dashboard',
            content: 'lorem Ipsum is simply dumm dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        };
        const data = await User.find(); 
        res.render('admin/admin_dashboard', { users: data, locals,layout : adminLayout ,user :  req.cookies.token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get all user 

router.get('/allUsers',isAuth('admin'), async (req, res) => {
    try {
        const locals ={
            title: 'ALL Users',
            content : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        };
       
        const data = await User.find(); 
        
        res.render('admin/admin_dashboard', {
            user: req.cookies.token,
            users: data, 
            locals,
            layout: adminLayout 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

//  ban a user
router.put('/ban-user/:id', isAuth('admin'), async (req, res) => {
    try {
        const userId = req.params.id; 
        await User.findByIdAndUpdate(userId, { $set: { banned: true } });
        
        
        res.redirect('/admin_dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//  unban a user
router.put('/unban-user/:id', isAuth('admin'), async (req, res) => {
    try {
        const userId = req.params.id; 
        await User.findByIdAndUpdate(userId, { $set: { banned: false } });
        res.redirect('/admin_dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports =router;