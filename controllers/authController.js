const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult} = require('express-validator');
const config = require('../config/config');

//generation d'un token jwt
const generateToken = (id) => {
  return  jwt.sign(
        {id},
        config.jwt.secret,
        {
            expiresIn: config.jwt.expiresIn,
        }
    );
}

/**
 * @desc Enregistrer un nouvel utilisateur
 * @route POST /api/auth/register
 * @access Public
 * @dev narci07
 */

const registerUser = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({success:false,error:"Veuillez bien remplir les champs"})
    }

    const {username,email,password} = req.body;

    try {
        let existUser = await User.findOne({email});
        if(existUser)
        {
            return res.status(400).json({success:false,error:"Un utilisateur avec cet email existe déjà"});
        }

        existUser = await User.findOne({username});
        if(existUser){
            return res.status(400).json({succes:false,error:"Un utilisateur avec ce nom existe déjà"});
        }

       const user = await User.create({username,email,password});

        res.status(201).json(
            {
                success:true,
                message:"Utilisateur enrégistré avec succès",
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            })

    } catch (error) {
        console.error(error)
        next(error);
    }
}

/**
 * @desc Authentifier l'utlisateur & récupérer le token
 * @route POST /api/auth/login
 * @access Public
 * @dev narci07
 */

const loginUser = async (req,res,next) => {
    const error = validationResult(req);

    if(!error.isEmpty())
    {
        return res.status(400).json({success:false,error: "Veuillez remplir tout les champs"});
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,error:"Email ou mot de passe invalide"});
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch)
        {
            return res.status(400).json({success:false,error:"Email ou mot de passe invalide"});
        }

        res.status(200).json({
            success:true,
            message: "Connexion réussie",
            token: generateToken(user._id),
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error)
        next(error);
    }
}

/**
 * @desc Obtenir le profil de l'utilisateur
 * @route GET /api/auth/profil
 * @access Private
 * @dev narci07
 */

const getUserProfile = async (req,res,next) => {
    try {
        res.status(200).json({
            success:true,
            user:req.user,
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
}