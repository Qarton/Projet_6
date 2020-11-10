const Sauce = require('../models/Sauce')
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  //delete thingObject._id;
  const thing = new Sauce({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    /*usersLiked: [],
    usersDisliked: []*/
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log(thingObject)
  Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
  Sauce.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));

};

exports.noteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.body.like === 1) {
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += req.body.like;
        console.log(sauce.usersLiked)
        const test = {
          usersLiked : sauce.usersLiked,
          likes : sauce.likes
        }
        Sauce.updateOne({ _id: req.params.id }, { ...test, _id: req.params.id })
          .then(() => res.status(200).json({ message: '+1' }))
          .catch(error => res.status(400).json({ error }));
      } else if (req.body.like === 0){
        let likeIndex = sauce.usersLiked.indexOf(req.body.userId);
        let dislikeIndex = sauce.usersDisliked.indexOf(req.body.userId);
        if(likeIndex > -1){
          sauce.usersLiked.splice(likeIndex, 1);
          sauce.likes -=1;
          const test = {
            usersLiked : sauce.usersLiked,
            likes : sauce.likes
          }
          Sauce.updateOne({ _id: req.params.id }, { ...test, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'aime plus' }))
            .catch(error => res.status(400).json({ error }));
        } else if(dislikeIndex > -1){
          sauce.usersDisliked.splice(dislikeIndex, 1);
          sauce.dislikes -=1;
          const test = {
            usersDisliked : sauce.usersDisliked,
            dislikes : sauce.dislikes
          }
          Sauce.updateOne({ _id: req.params.id }, { ...test, _id: req.params.id })
            .then(() => res.status(200).json({ message: '-1' }))
            .catch(error => res.status(400).json({ error }));
        }

      } else if (req.body.like === -1){
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes -= req.body.like;
          const test = {
            usersDisliked : sauce.usersDisliked,
            dislikes : sauce.dislikes
          }
          Sauce.updateOne({ _id: req.params.id }, { ...test, _id: req.params.id })
            .then(() => res.status(200).json({ message: '-1' }))
            .catch(error => res.status(400).json({ error }));
      }
    })
}