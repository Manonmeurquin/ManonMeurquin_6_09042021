const jwt = require('jsonwebtoken'); // package de vérification du token

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //Extraction du token dans le header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Décoder, vérifier le token avec le package et la clé secrète qui doit correspondre à celle de la fonction login
    const userId = decodedToken.userId;// On récupère le userId qui a été encodé dans l’objet du token
    if (req.body.userId && req.body.userId !== userId) { // Si userId différent : erreur
      throw 'Invalid user ID';
    } else { // Si c’est le même on appelle next pour appliquer la requête suivante
      next();
    }
  } catch {
    res.status(401).json({  //Problème d’authentification
      error: new Error('Invalid request!')
    });
  }
};