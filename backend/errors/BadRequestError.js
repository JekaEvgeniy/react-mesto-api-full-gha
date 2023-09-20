module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = message || 'Переданые неверные данные.';
    this.statusCode = 400;
  }
};

// Example: throw new BadRequestError();
