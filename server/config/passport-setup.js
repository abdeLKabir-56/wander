const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;


passport.use(new FacebookStrategy({
  clientID: keys.facebook.clientID,
  clientSecret: keys.facebook.ClientSecret,
  callbackURL: "/auth/facebook/redirect",
  profileFields: ['id', 'email', 'first_name', 'last_name', 'friends', 'location', 'picture.width(200).height(200)']
},
(accessToken, refreshToken, profile, done) => {
    console.log(profile);
  const userId = profile.id;
  
  const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
  const name = {
      familyName: profile.name.familyName,
      givenName: profile.name.givenName
  };
  const username = profile.displayName ? profile.displayName : name.familyName + name.givenName;
  const image = profile.photos[0].value;
  User.findOne({ id: userId, username:username,email:email})
      .then(currentUser => {
          if (currentUser) {
              // User already exists, update the information if necessary
              currentUser.username = username;
              currentUser.email = email;
              currentUser.name = name;
              currentUser.image = image;
              currentUser.save()
                  .then(savedUser => {
                      done(null, savedUser);
                  })
                  .catch(err => {
                      done(err);
                  });
          } else {
              // Create a new user
              const newUser = new User({
                  id: userId,
                  username: username,
                  email: email,
                  name: name,
                  image: image,
                  bio: ''
              });
              newUser.save()
                  .then(savedUser => {
                      done(null, savedUser);
                  })
                  .catch(err => {
                      done(err);
                  });
          }
      })
      .catch(err => {
          done(err);
      });
}));

// google strategy implementation
passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.ClientSecret, // Corrected property name
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let currentUser = await User.findOne({ id: profile._id, email: profile.email,username: profile.username});
        if (currentUser) {
            // User already exists
            console.log('User already exists:', currentUser);
            done(null, currentUser);
        } else {
            // Create a new user
            const newUser = new User({
                id: profile.id,
                username: profile.displayName,
                name: {
                    familyName: profile.name.familyName,
                    givenName: profile.name.givenName
                },
                image: profile.photos,
                email: (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '',
                bio: ''
            });
            await newUser.save();
            console.log('New user created:', newUser);
            done(null, newUser);
        }
    } catch (err) {
        console.error('Error in Google authentication:', err);
        done(err);
    }
}));


passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
passport.serializeUser((user, done) => {
    done(null, user._id);
  });
module.exports = passport;