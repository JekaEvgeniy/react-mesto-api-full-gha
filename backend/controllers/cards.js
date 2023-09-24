const { codeErrors, codeSuccess } = require('../vars/data');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      console.log('>>>>>>> getCards');
      console.log(cards);
      // res.send({ data: cards });
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(codeSuccess.created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// const removeCard = (req, res, next) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Карточка с указанным _id не найдена.');
//       } else {
//         res.send({ data: card });
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Введены некорректные данные'));
//       } else {
//         next(err);
//       }
//     });
// };

const removeCard = (req, res, next) => {
  // Card.findByIdAndRemove(req.params.cardId)
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (!card.owner.equals(req.user.id)) {
        next(new ForbiddenError('Карточка с указанным _id не найдена.'));
      } else {
        return Card.deleteOne(card)
          .then(() => res.send(card));
      }
    })
    .catch(next);
};

const getCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена.')))
    .then((card) => {
      if (card) {
        res.status(codeSuccess.ok).send(card);
      } else {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === 'Not Found') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(codeSuccess.ok).send(card);
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(codeSuccess.ok).send(card);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные ${err.path}`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, createCard, removeCard, getCardById, likeCard, dislikeCard,
};
