const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // https://www.npmjs.com/package/celebrate

const { codeErrors } = require('../vars/data');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, getCurrentUser, login } = require('../controllers/users');
const auth = require('../widdlewares/auth');

// https://regex101.com/
// ТЗ: Поле password не ограничено в длину, так как пароль хранится в виде хеша
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/^(http|https):\/\/(?:www\.)?[a-zA-Z0-9._~\-:?#[\]@!$&'()*+,/;=]{2,256}\.[a-zA-Z0-9./?#-]{2,}$/),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/me', getCurrentUser);

router.use('*', (req, res) => {
  res.status(codeErrors.notFound).send({
    message: 'Запрашиваемой страницы нет!',
  });
});

module.exports = router;
