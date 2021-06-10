const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('../passport/local');

const db = require('../db/connection');

router.get('/', (req,res) => {
    res.status(200).send('It works!');
});

router.post('/signup', async (req,res) => {
    const data = req.body;

    try {
        const findUser = await db('users').where('email', data.email).first();

        if(findUser) return res.status(401).send({ msg: 'User already exists' });

        const createUser = {
            ...data,
            password: bcrypt.hashSync(data.password, 12)
        };

        await db('users').insert(createUser);

        res.status(201).send({ msg: 'User has been created succesfully!' });
    } catch(err) {
        res.status(500).send(err);
    }
});

router.post('/login', passport.authenticate('local', { successRedirect: 'protected', failureRedirect: 'failure' }));

router.get('/protected', (req,res) => {
    if(req.isAuthenticated()) {
        res.send('Welcome to the club');
    } else {
        res.status(401).send('What are you doing here? >:(');
    }
});

module.exports = router;