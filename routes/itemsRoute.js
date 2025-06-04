const express = require('express');
const  {
    getItems,
    getItemsById,
    addItem,
    updateItem,
    deleteItem  
} = require('../controllers/itemController');

const {body} = require('express-validator');
const {protect} = require('../middlewares/authMiddleware');
const router = express.Router();


router.route('/')
    .get(protect,getItems)
    .post(protect,[
        body('name').notEmpty().withMessage("Le nom de l'émement est requis"),
        body('description').notEmpty().withMessage("Veuillez renseigner la description")
    ], addItem);

router.route('/:id')
    .get(protect,getItemsById)
    .put(protect,[
        body('name').optional().notEmpty().withMessage("Le nom de l'élement est requis"),
        body('description').optional().notEmpty().withMessage("La description est requise")
    ],updateItem)
    .delete(protect,deleteItem);

module.exports = router;