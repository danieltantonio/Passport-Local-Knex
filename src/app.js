const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');

const auth = require('./routers/auth');

const storeOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const store = new MySQLStore(storeOptions);

/*  MIDDLEWARE  */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    key: 'su.sid',
    secret: process.env.SECRET,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

/*  ROUTERS  */
app.use('/', auth);

module.exports = app;