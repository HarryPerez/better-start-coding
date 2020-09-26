const errors = require('./errors');

module.exports = {
  email: {
    in: ['body'],
    isEmail: true,
    errorMessage: errors.USER.EMAIL,
  },
  password: {
    in: ['body'],
    isString: true,
    errorMessage: errors.USER.PASSWORD,
  },
  admin: {
    in: ['body'],
    isBoolean: true,
    optional: true,
  },
};
