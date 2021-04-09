const User = require('../models/User'); // On importe le modèle
const bcrypt = require ('bcrypt'); // Package de cryptage
const jwt = require('jsonwebtoken'); //Package de création et de vérification des token

exports.signup = (req, res, next) => { // Fonction pour l'enregistrement de l'user 
    bcrypt.hash(req.body.password, 10) // Fonction asynchrone de hashage bcrypt, on "sale" le mdp 10 fois pour exécuter l'algorithme
      .then(hash => {
        const user = new User({ // Création d’un nouveau user avec mdp cryptée et email
          email: req.body.email,
          password: hash
        });
        user.save() //méthode pour enregistrer dans la bdd
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => { // fonction de connexion de l’utilisateur
    User.findOne({ email: req.body.email }) // Trouver un seul user de la bdd avec email unique
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // compare le mdp envoyé par l’utilisateur en train de se connecter avec le hash enregistré avec le user dans la bdd
          .then(valid => { // Boolean si comparaison est valable ou non
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });//si renvoie false
            }
            res.status(200).json({ //si renvoie true, objet json avec identifiant et token
              userId: user._id,
              token: jwt.sign( //fonction de jsonwebtoken avec comme arguments :
                { userId: user._id }, // les données que l’on veut encoder dont l'userId
                'RANDOM_TOKEN_SECRET', // clé secrète pour l’encodage
                { expiresIn: '24h' } // configuration du délai d’expiration du token
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };