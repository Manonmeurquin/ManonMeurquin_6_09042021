const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const rateLimit = require('../middleware/rate-limit');

router.post('/signup', authCtrl.signup);
router.post('/login', rateLimit, authCtrl.login);

module.exports = router;