const { codeErrors, codeSuccess } = require('../vars/data');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(codeSuccess.ok).send(cards))
    .catch((err) => res.status(codeErrors.serverError).send({
      message: 'Ошибка по умолчанию',
      err: err.message,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(codeSuccess.created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeErrors.badRequest).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(codeErrors.notFound).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const getCardById = (req, res) => {
  const textError = 'Not Found';

  Card.findById(req.params.id)
    .orFail(() => {
      const error = new Error(textError);
      error.statusCode = codeErrors.notFound;
      return error;
    })
    .then((card) => {
      if (card) {
        res.status(codeSuccess.ok).send(card);
      } else {
        res.status(codeErrors.notFound).send({
          message: 'Передан несуществующий _id карточки.',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeErrors.badRequest).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.name === textError) {
        res.status(codeErrors.notFound).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(codeSuccess.ok).send(card);
      } else {
        res.status(codeErrors.notFound).send({
          message: 'Передан несуществующий _id карточки.',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeErrors.badRequest).send({
          message: `Ошибка: ${err} => Переданы некорректные данные для постановки лайка`,
        });
      } else if (err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({
          message: `Ошибка: ${err} =>  Карточка с указанным _id не найдена.`,
        });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(codeSuccess.ok).send(card);
      } else {
        res.status(codeErrors.notFound).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeErrors.badRequest).send({
          message: 'Переданы некорректные данные для снятии лайка',
        });
      } else if (err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getCards, createCard, removeCard, getCardById, likeCard, dislikeCard,
};
