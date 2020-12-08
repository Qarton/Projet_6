const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const {body} = require('express-validator');
//Route pour l'enregistrement et l'authentification d'un Utilisateur
router.post('/signup', [body('email').isEmail(),body('password').isLength({ min: 3 })], userCtrl.signup);
router.post('/login', [body('email').isEmail(),body('password').isLength({ min: 3 })], userCtrl.login);

module.exports = router;