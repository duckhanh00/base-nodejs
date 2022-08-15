const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const crypto = require('crypto');

const { User } = require('../models')

module.exports = (passport) => {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(async (user, done) => {
        console.log("serializeUser",user._id)
        let token = await crypto.randomBytes(16)?.toString('hex')
        let data = {
            token: token,
            expires: Date.now() + 10000,
            userId: user?._id
        }
        done(null, JSON.stringify(data));
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            if(err){
                done(err);
            }
            done(null, user);
        })
    });
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        // điền thông tin để xác thực với Facebook.
        // những thông tin này đã được điền ở file auth.js
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id','displayName','email','first_name','last_name','middle_name']
    }, async (token, refreshToken, profile, done) => {
        try {
            try {
                const { sub, email, picture, name } = profile._json

                let user = await User.findOne({ facebookId: sub })
                if (user) {
                    done(null, user)
                } else {
                    await User.updateOne(
                        { email: email },
                        {
                            $set: {
                                facebookId: sub,
                            }
                        },
                        {
                            upsert: true
                        }
                    )
                    user = await User.findOne({ facebookId: sub })
                    done(null, user)
                }
            } catch (error) {
                done(error)
            }
        } catch (error) {
            done(error)
        }
    }));

    // =======================================================================
    // GOOGLE ================================================================
    // =======================================================================
    passport.use(new GoogleStrategy(
        {
          clientID: process.env.GG_CLIENT_ID,
          clientSecret: process.env.GG_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback'
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const { sub, email, picture, name } = profile._json

                let user = await User.findOne({ googleId: sub })
                if (user) {
                    done(null, user)
                } else {
                    await User.updateOne(
                        { email: email },
                        {
                            $set: {
                                googleId: sub,
                            }
                        },
                        {
                            upsert: true
                        }
                    )
                    user = await User.findOne({ googleId: sub })
                    done(null, user)
                }
            } catch (error) {
                done(error)
            }
        }
    ));

    // =======================================================================
    // GITHUB ================================================================
    // =======================================================================
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
            const { id } = profile._json

            let user = await User.findOne({ githubId: id })
            if (user) {
                done(null, user)
            } else {
                await User.create({ githubId: id })
                user = await User.findOne({ githubId: id })
                done(null, user)
            }
        } catch (error) {
            done(error)
        }
      }
    ));
};