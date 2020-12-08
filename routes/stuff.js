const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
const auth = require ('../middleware/auth');
const multer = require('../middleware/multer-config');
//Route pour la gestion de l'affichage des sauces
router.get('/', auth, stuffCtrl.getAllStuff);
router.get('/:id',  auth, stuffCtrl.getOneSauce);

//Route pour la gestion de l'ajout, modification et suppression
router.post('/', auth, multer, stuffCtrl.createSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
//Route pour la gestion like/dislike
router.post('/:id/like', auth, stuffCtrl.noteSauce);

module.exports = router;