const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;
const isAuth = require('../middleware/auth');

router.get('/google', passport.authenticate('google', {
    scope: ['profile','email']
}));
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('redirect to dashboard'+req.user);
    res.redirect('/profile');
});

router.get('/facebook',passport.authorize('facebook', {
    scope: ['public_profile', 'email']
  }));

router.get('/facebook/redirect',passport.authenticate('facebook'), (req, res) => {
    console.log('redirect to dashboard'+req.user);
    //res.send(req.user);
    res.redirect('/profile');
});

module.exports = router;