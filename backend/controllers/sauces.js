const Sauce = require('../models/sauces');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  switch (like) {  
    case 1: Sauce.updateOne({ _id: sauceId }, { $inc: { likes: 1 }, $push: { usersLiked: userId } })
      .then(() => res.status(200).json({ message: 'Sauce likée !' }))
      .catch(error => res.status(400).json({ error }));
      break;
    case 0: Sauce.findOne({ _id: sauceId })
      .then(sauce => {
        const likesOrDislikes = {};
        const usersLikedOrDisliked = {};
        if (sauce.usersLiked.includes(userId)) {
          likesOrDislikes.likes = -1;
          usersLikedOrDisliked.usersLiked = userId;
        } else if (sauce.usersDisliked.includes(userId)) {
          likesOrDislikes.dislikes = -1;
          usersLikedOrDisliked.usersDisliked = userId;
        }
        Sauce.updateOne({ _id: sauceId }, { $inc: likesOrDislikes, $pull: usersLikedOrDisliked })
          .then(() => res.status(200).json({ message: 'Modifé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
      
      break;
    case -1: Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
      .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
      .catch(error => res.status(400).json({ error }));
      break;
  }

};
