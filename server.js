const express = require('express');
const dotenv = require('dotenv');
const connectDB  = require('./config/db');
const config = require('./config/config');
const authRoutes = require('./routes/authRoute');
const itemsRoutes = require('./routes/itemsRoute');

//charger les variables d'environnement
dotenv.config();

//db connexion
connectDB();

const app = express();

//middleware pour parser les JSON dans les requêtes
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);

const PORT = config.server.port;


module.exports = app;
