const express = require('express');

const router = express.Router();

router.get('/list', (req, res) => res.json({ msg: "User List" }));

module.exports = router