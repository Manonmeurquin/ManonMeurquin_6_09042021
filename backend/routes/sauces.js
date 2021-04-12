const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.getAllSauces); // Récupère toutes les sauces
router.get('/:id', auth, saucesCtrl.getOneSauce); // Récupère une seule sauce
router.post('/', auth, multer,saucesCtrl.createSauce); // Crée une sauce
router.put('/:id', auth, saucesCtrl.modifySauce); // Modifie une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Supprimer une sauce
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce); //liker une sauce

module.exports = router;