module.exports = class UnauthorizedError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Доступ заблокирован. Требуется авторизация.';
    this.statusCode = 401;
  }
};
// Example: throw new UnauthorizedError();
