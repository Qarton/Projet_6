const Sauce = require('../models/Sauce');
const fs = require('fs');
const { validationResult } = require('express-validator');

//Création d'une Sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

//Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Modification d'une Sauce
exports.modifySauce = (req, res, next) => {
  if (!req.file){
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
    
} else {
  let sauceObject = {...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !' }))
  .catch(error => res.status(400).json({ error }));
    });
});


  
}
  
};


//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Affichage des sauces
exports.getAllStuff = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));

};


//Notation d'une sauce
exports.noteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      
      if (req.body.like === 1) {
        //Ajout d'un like
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += req.body.like;
        let liked = {
          usersLiked: sauce.usersLiked,
          likes: sauce.likes
        };
        Sauce.updateOne({ _id: req.params.id }, { ...liked, _id: req.params.id })
          .then(() => res.status(200).json({ message: '+1' }))
          .catch(error => res.status(400).json({ error }));
      } else if (req.body.like === 0) {
        //Suppression d'un like
        let likeIndex = sauce.usersLiked.indexOf(req.body.userId);
        let dislikeIndex = sauce.usersDisliked.indexOf(req.body.userId);
        if (likeIndex > -1) {
          sauce.usersLiked.splice(likeIndex, 1);
          sauce.likes -= 1;
          let liked = {
            usersLiked: sauce.usersLiked,
            likes: sauce.likes
          };
          Sauce.updateOne({ _id: req.params.id }, { ...liked, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'aime plus' }))
            .catch(error => res.status(400).json({ error }));
        } else if (dislikeIndex > -1) {
          //Suppression d'un dislike
          sauce.usersDisliked.splice(dislikeIndex, 1);
          sauce.dislikes -= 1;
          let disliked = {
            usersDisliked: sauce.usersDisliked,
            dislikes: sauce.dislikes
          };
          Sauce.updateOne({ _id: req.params.id }, { ...disliked, _id: req.params.id })
            .then(() => res.status(200).json({ message: '-1' }))
            .catch(error => res.status(400).json({ error }));
        }

      } else if (req.body.like === -1) {
        //Ajout d'un dislike
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes -= req.body.like;
        let disliked = {
          usersDisliked: sauce.usersDisliked,
          dislikes: sauce.dislikes
        };
        Sauce.updateOne({ _id: req.params.id }, { ...disliked, _id: req.params.id })
          .then(() => res.status(200).json({ message: '-1' }))
          .catch(error => res.status(400).json({ error }));
      };
    });
};