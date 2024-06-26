const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers); // Пути суммируются /users/users см. внимательно index.js

router.post('/', createUser);

router.get('/me', getCurrentUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

router.post('/signup', createUser);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/https?:\/\/(www)?[-0-9a-z.]+(\/[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+)?#?$/i),
    }),
  }),
  updateAvatar,
);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

module.exports = router;
