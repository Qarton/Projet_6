const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
//Route pour l'enregistrement et l'authentification d'un Utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;