const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const rateLimit = require("express-rate-limit"); // Sert à limiter les requêtes

const logLimiter = rateLimit({ // Je limite les requêtes envoyées par l'utilisateur
    windowMs:60 * 60 * 1000, // 1 heure
    max: 100, // limite à 100 requêtes
    message: "Too many request "
});

router.post('/signup',logLimiter, authCtrl.signup);
router.post('/login',logLimiter, authCtrl.login);

module.exports = router;