require('dotenv').config(); // Charge les variables d'environnement à partir du fichier .env et .env-mentor
const express = require('express');
const mongoose = require('mongoose'); //MongoDB Bdd

const helmet = require('helmet'); // Sécrurise l'en-tête contre les attaques XSS

const authRoutes = require('./routes/auth');
const sauceRoutes = require('./routes/sauces');
const path = require('path'); // Permet d'accéder aux chemins des fichiers (ici pour les images)

const app = express();


mongoose.connect(`mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PWD}@cluster0.vrg0b.mongodb.net/SoPekocko?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Accéder à l’API depuis n’importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Quel headers HTTP peuvent être utilisés pendant la requête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Envoyer des requêtes avec les méthodes mentionnées
    next();
});

app.use(helmet());
app.use(express.json()); //Définir comme midlwre global

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authRoutes); // Routes liées à l'authentification
app.use('/api/sauces', sauceRoutes);
module.exports = app;