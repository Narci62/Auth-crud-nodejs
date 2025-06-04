const express = require('express');
const {registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const router = express.Router();

router.post('/register',[
        body('username').isLength({min:3}).withMessage("Le nom d'utilisateur doit contenir au moins 3 caractère"),
        body('email').isEmail().withMessage("Veuillez entrer une adresse email valide"),
        body('password').isLength({min:6}).withMessage('Le mot de passe doit contenir au moins 6 caractère'),
    ],
    registerUser
);

router.post('/login',[
    body('email').isEmail().withMessage("Veuillez entrer un email valide"),
    body('password').notEmpty().withMessage('Le mot de passe est requis.')
],loginUser);

router.get('/profile',protect,getUserProfile);

module.exports = router;