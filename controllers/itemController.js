const Item = require('../models/Item');
const {validationResult} = require('express-validator');

/**
 * @desc Obtenir tous les élements
 * @route GET /api/items
 * @access Private
 * @dev narci07
 */

const getItems = async (req,res,next) => {
    try {
       const items = await Item.find({owner:req.user._id}); 
       res.status(200).json({
        success:true,
        count: items.length,
        data: items
       })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

/**
 * @desc Obtenir un seul élement par son ID
 * @route GET /api/items/:id
 * @access Private
 * @dev narci07
 */

const getItemsById = async (req,res,next) =>{
    try {
        const item = await Item.findOne({ _id: req.params.id, owner: req.user._id });
        if(!item){
            return res.status(404).json({success:false,error:"Elément introuvable"});
        }

        res.status(200).json({
            success:true,
            data:item
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
}

/**
 * @desc Ajouter un nouvel élement
 * @route POST /api/items
 * @access Private
 * @dev narci07
 */

const addItem = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({success:false,error:"Veuillez remplir tous les champs"});
    }

    const {name,description} = req.body;

    try {
        const newItem = await Item.create({name,description,owner:req.user._id});
        res.status(201).json({
            success:true,
            message: "Elément ajouté avec succès",
            data: newItem
        })
    } catch (error) {
        console.error("Erreur lors de la création d'un item :", error);
        res.status(500).json({ success: false, error: "Erreur serveur" });
    }
}

/**
 * @desc Mettre à jour un élément
 * @route UPDATE /api/items/:id
 * @access Private
 * @dev narci07
 */

const updateItem = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,error:"Veuilez fournir toutes les informations"});
    }
    try {
        const item = await Item.findOne({_id:req.params.id, owner:req.user._id});
        if(!item){
            return res.status(400).json({success:false,error:"Elémenet introuvable"});
        }
        const {name,description} = req.body;
        const newItem = await Item.findByIdAndUpdate({_id:item._id},{name,description});

    } catch (error) {
        console.error(error);
        next(error);
    }
}

/**
 * @desc Supprimer un élément
 * @route DELETE /api/items/:id
 * @access Private
 * @dev narci07
 */

const deleteItem = async (req,res,next) => {
    try {
        const item = await Item.findOne({_id:req.params.id, owner: req.user._id});
        if(!item){
            return res.status(400).json({success:false,error:"Elément introuvable"});
        }
        await Item.deleteOne();

        res.status(200).json({
            success:true,
            message: "Elément supprimé avec succès"
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    getItems,
    getItemsById,
    addItem,
    updateItem,
    deleteItem  
}