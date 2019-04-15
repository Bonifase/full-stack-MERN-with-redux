const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs')

//Load user model
const User = require('../../models/User');

router.get('/list', (req, res) => res.json({ msg: "User List" }));

//Register user
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ "msg": `User with ${user.email} already exist` })
            } else {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => res.status(200).json(user)).catch(err => console.log(err));
                    })
                })
            }
        });
})

module.exports = router