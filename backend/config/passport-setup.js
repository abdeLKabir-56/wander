
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');




//serialze the user
passport.serializeUser((user,done)=>{
    done(null,user.id);
})
//deserialze the user
passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
    
})

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.ClientSecret,
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => {
    //check if the user is already in the database
    User.findOne({id: profile.id}).then((currentUser) => {
        if(currentUser)
        {
            // already in the database
           console.log('user is already in'+currentUser);
            done(null, currentUser);
        }else{
            // create a new user
            new User({
        id: profile.id,
        username: profile.displayName,
        email: profile.email
    }).save()
        .then(newUser => {
            console.log('New user created: ', newUser);
        })
        .catch(err => console.error('Error creating new user:', err));
        }
    })
    
}));




module.exports = passport;
