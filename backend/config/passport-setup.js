const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;





passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.ClientSecret,
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => {
    //check if the user is already in the database
    console.log(profile);
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
        image: profile._json.picture
    }).save()
        .then(newUser => {
            console.log('New user created: ', newUser);
        })
        .catch(err => console.error('Error creating new user:', err));
        }
    })
    
}));


passport.deserializeUser((id, done) => {
    // Retrieve the user object from the database using the serialized ID
    User.findById(id)
      .then(user => {
        if (!user) {
          // User not found, return an error or 'false'
          return done(null, false);
        }
        // User found, return the user object
        done(null, user);
      })
      .catch(err => {
        // Handle errors during database interaction
        done(err, null);
      });
  });
passport.serializeUser((user, done) => {
    // Store the user's ID in the session
    done(null, user._id); // Replace "_id" with your actual unique user identifier field
  });
module.exports = passport;