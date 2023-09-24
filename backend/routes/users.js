const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers); // Пути суммируются /users/users см. внимательно index.js
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      // id: Joi.string().length(24).hex(),
      id: Joi.string().length(24).hex(),
    }),
  }),
  getUserById,
);
router.get('/me', getCurrentUser);

router.post('/', createUser);
router.post('/signup', createUser);

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
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/^(http|https):\/\/(?:www\.)?[a-zA-Z0-9._~\-:?#[\]@!$&'()*+,/;=]{2,256}\.[a-zA-Z0-9./?#-]{2,}$/),
    }),
  }),
  updateAvatar,
);

module.exports = router;
