const passport = require('passport');
const db = require('../db/connection');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        db('users').where({ id:user.id }).first()
        .then(id => {
            done(null, id);
        })
        .catch(err => {
            done(err);
        });
    });
}