const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  if (!req.cookies) {
    return next(new UnauthorizedError());
  }

  let payload;
  const token = req.cookies.jwt;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'my-secret-code');
  } catch (err) {
    next(new UnauthorizedError());
  }

  req.user = payload;
  next();
};

module.exports = auth;
