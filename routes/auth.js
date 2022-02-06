const express = require('express');
const auth = require('../controllers/auth');

const router = express.Router();

router.post('/register', auth.register);

router.post('/login', auth.login);

router.post('/token', auth.token);

router.delete('/logout', auth.logout);

module.exports = router;