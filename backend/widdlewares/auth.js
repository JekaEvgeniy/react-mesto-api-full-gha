const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  if (!req.cookies) {
    return next(new UnauthorizedError());
  }

  let payload;
  const token = req.cookies.jwt;

  try {
    payload = jwt.verify(token, process.env.JWT_CODE);
  } catch (err) {
    return next(new UnauthorizedError());
  }

  req.user = payload;
  next();
};

module.exports = auth;
