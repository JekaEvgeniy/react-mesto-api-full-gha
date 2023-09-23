const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { codeErrors, codeSuccess } = require('../vars/data');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res) => {
  // console.log('POST /login');
  if (!req.body) {
    throw new ForbiddenError('Неправильный логин/пароль');
  }

  const { email, password } = req.body;

  if (!email && !password) {
    // return res.status(400).send({ message: 'Поля email и password обязательны для заполнения' });
    next(new BadRequestError('Поля email и password обязательны для заполнения'));
  }

  // return User.findUserByCredentials(email, password)
  //   .then((user) => {
  //     const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
  //     // res.send({ data: user.toJSON() }); // .send(user);
  //     res.send({ token });
  //   })
  //   .catch((err) => {
  //     console.error('>>> login.js ERROR');
  //     console.error(err);
  //     next(err);
  //   });

  return User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))

    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'my-secret-code',
              { expiresIn: '1d' },
            );

            res.cookie('jwt', token, {
              maxAge: 360000 * 24 * 1,
              httpOnly: true,
              sameSite: true,
            }).send({ data: user.toJSON() }); // .send(user);
          } else {
            // С throw Postman Не вываливает сообщение о ошибках. >>> Could not get response
            // next(new ForbiddenError('Неправильный логин/пароль'));
            throw new ForbiddenError('Неправильный логин/пароль');
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res) => {
  // console.log('POST /signup >>> users.js > createUser');

  if (!req.body) {
    next(new BadRequestError('Введены некорректные данные'));
  }

  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email && !password) {
    next(new BadRequestError('Поля email и password обязательны для заполнения'));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError('При регистрации указан email, который уже существует на сервере'));
      }

      bcrypt.hash(String(req.body.password), 10)
        .then((hash) => {
          User.create({
            name, about, avatar, email, password: hash,
          })
            .then(() => {
              res.status(codeSuccess.created).send({
                data: {
                  name, about, avatar, email,
                },
              });
            })
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(new BadRequestError('Введены некорректные данные'));
              }
              if (err.code === 11000) {
                next(new ConflictError('Пользователь с таким email уже существует'));
              }
              next(err);
            });
        });
    });
};

const getUsers = (req, res) => {
  // console.log('GET /users');
  // console.log(111, req.user);//{ _id: '650323047e49e29bf8466e52', iat: 1694712469 }

  User.find({})
    .then((users) => res.status(codeSuccess.ok).send(users))
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.statusCode === codeErrors.notFound) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Not Found');
      error.statusCode = codeErrors.notFound;
      return error;
    })
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        throw NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.statusCode === codeErrors.notFound) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        throw NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        throw NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login, getUsers, getCurrentUser, getUserById, createUser, updateUser, updateAvatar,
};
