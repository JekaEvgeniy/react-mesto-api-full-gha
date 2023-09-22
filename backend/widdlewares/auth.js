const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  // if (!req.cookies) {
  //   return next(new UnauthorizedError());
  // }

  // const token = req.cookies.jwt;

  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   throw new UnauthorizedError();
  // }
  const { authorization } = req.headers;
  if (!authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }

  const token = authorization.split('Bearer ')[1];
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'my-secret-code');
  } catch (err) {
    next(new UnauthorizedError());
  }

  req.user = payload;
  next();
};

module.exports = auth;
