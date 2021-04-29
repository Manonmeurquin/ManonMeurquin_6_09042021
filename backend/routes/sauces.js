const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');
const rateLimit = require("express-rate-limit"); // Sert à limiter les requêtes

const limiter = rateLimit({ // Je limite les requêtes envoyées par l'utilisateur
    windowMs:60 * 60 * 1000, // 1 heure
    max: 50, // limite à 50 requêtes
    message: "Too many request "
});

router.get('/',limiter, auth, saucesCtrl.getAllSauces); // Récupère toutes les sauces
router.get('/:id',limiter, auth, saucesCtrl.getOneSauce); // Récupère une seule sauce
router.post('/',limiter, auth, multer,saucesCtrl.createSauce); // Crée une sauce
router.put('/:id',limiter, auth, multer,saucesCtrl.modifySauce); // Modifie une sauce
router.delete('/:id',limiter, auth, saucesCtrl.deleteSauce); // Supprimer une sauce
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce); //liker une sauce

module.exports = router;