// Imports
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const cors = require('cors');
const path = require('path');

// Ajout des routes pour l'identification & l'authentification
const routesPosts = require('./routes/routesPosts');
const routesUsers = require('./routes/routesUsers');
const routesMod = require('./routes/routesMod');

 // initialisation de la variable app qui contiendra 'express'
const app = express();
app.use(helmet());
app.use(cors());

// CROSS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Body Parser
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

// Enregistrement du routeur pour toutes les demandes effectuées vers /api/posts.
app.use('/api/posts', routesPosts);

// Enregistrement du routeur pour toutes les demandes effectuées vers /api/auth.
app.use('/api/auth', routesUsers);

// Enregistrement du routeur pour toutes les demandes effectuées par les modérateurs.
app.use('/api/moderator', routesMod);

module.exports = app;