const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const db = require('../db/connection');
const init = require('./passport');

init();

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        db('users').where({email}).first()
        .then(user => {
            if(!user) return done(null, false);

            if(!bcrypt.compareSync(password, user.password)) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        })
        .catch(err => {
            done(err);
        });
    }
));

module.exports = passport;