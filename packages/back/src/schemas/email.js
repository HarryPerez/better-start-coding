const errors = require('./errors');

module.exports = {
  email: {
    in: ['body'],
    isEmail: true,
    errorMessage: errors.USER.EMAIL,
  },
};
