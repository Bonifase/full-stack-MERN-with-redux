const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//Load user model
const User = require("../../models/User");

router.get("/list", (req, res) => res.json({ msg: "User List" }));

//Register user
router.post("/register", (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ msg: `User with ${user.email} already exist` });
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
                    newUser
                        .save()
                        .then(user => res.status(200).json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

//Log in User
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.status(400).json({ msg: "User not available" });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = { id: user.id, name: user.username };
                jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
                    res.status(200).json({
                        authToken: "Bearer " + token,
                        success: true,
                        msg: "login successful"
                    });
                });
            } else {
                return res.status(401).json({ msg: "Wrong password" });
            }
        });
    });
});

//return current user
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.username,
        email: req.user.email
    });
});

module.exports = router;