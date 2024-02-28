
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.ClientSecret,
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => {
    
    new User({
        id: profile.id,
        username: profile.displayName,
        email: profile.email
    }).save()
        .then(newUser => {
            console.log('New user created: ', newUser);
        })
        .catch(err => console.error('Error creating new user:', err));
}));




module.exports = passport;
