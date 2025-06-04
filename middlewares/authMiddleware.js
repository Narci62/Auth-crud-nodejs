const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // extraction du token
            token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(401).json({ success: false, error: "Non autorisé, pas de token" });
            }

            // vérification du token
            const decoded = jwt.verify(token, config.jwt.secret);

            // récupération de l'utilisateur (sans le mot de passe)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, error: "Non autorisé, utilisateur introuvable" });
            }

            next();
        } catch (error) {
            console.error(error);

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, error: "Token expiré" });
            }

            return res.status(401).json({ success: false, error: "Token invalide" });
        }
    } else {
        return res.status(401).json({ success: false, error: "Non autorisé, pas de token" });
    }
};


module.exports = { protect };