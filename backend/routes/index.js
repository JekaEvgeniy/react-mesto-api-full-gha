const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // https://www.npmjs.com/package/celebrate

const { codeErrors } = require('../vars/data');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, getCurrentUser, login } = require('../controllers/users');
const auth = require('../widdlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

// Краш-тест сервера
// ATTENTION: Не забудьте удалить этот код после успешного прохождения ревью.
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// END ATTENTION: Не забудьте удалить этот код после успешного прохождения ревью.

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
      avatar: Joi.string().regex(/https?:\/\/(www)?[-0-9a-z.]+(\/[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+)?#?$/i),
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

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемой страницы нет!'));
});

module.exports = router;
