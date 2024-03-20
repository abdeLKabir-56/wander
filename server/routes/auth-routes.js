const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;

router.get('/google', passport.authenticate('google', {
    scope: ['profile','email']
}));
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
     res.send(req.user);
    res.redirect('/dashboard');
});
router.get('/facebook',passport.authorize('facebook', {
    scope: ['public_profile', 'email']
  }));

router.get('/facebook/redirect',passport.authenticate('facebook'), (req, res) => {
    //res.send(req.user);
    res.redirect('/dashboard');
});







module.exports = router;