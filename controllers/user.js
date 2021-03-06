const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const { validationResult } = require('express-validator');


//Création d'un Utilisateur
exports.signup = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Cryptage du mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.json(error));
        })
        .catch(error => res.status(500).json({ error }));
};
//Connexion d'un Utilisateur
exports.login = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //Création d'un token de connexion
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                {userId: user._id},
                `${process.env.TOKEN}`,
                {expiresIn: '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };