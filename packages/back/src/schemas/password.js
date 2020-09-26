const errors = require('./errors');

module.exports = {
  password: {
    in: ['body'],
    isString: true,
    isLength: {
      errorMessage: errors.USER.PASSWORD_LENGTH,
      options: { min: 8 },
    },
    matches: {
      options: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[A-Za-z\d]{8,}$/,
      errorMessage: errors.USER.PASSWORD_TYPE,
    },
    errorMessage: errors.USER.PASSWORD,
  },
};
