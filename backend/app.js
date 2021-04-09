const express = require('express');
const mongoose = require('mongoose'); //MongoDB Bdd

const authRoutes = require('./routes/auth');
const sauceRoutes = require('./routes/sauces');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://manon_15:edinson@cluster0.vrg0b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Accéder à l’API depuis n’importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Envoyer des requêtes avec les méthodes mentionnées
    next();
});

app.use(express.json()); //Définir comme midlwre global

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authRoutes); // Routes liées à l'authentification
app.use('/api/sauces', sauceRoutes);
module.exports = app;