const express = require('express');
const router = express.Router();
const { login } = require('../controller/Login/auth.js');

router.post('/login', login);

module.exports = router;