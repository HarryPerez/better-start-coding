const errors = require('./errors');

module.exports = {
  name: {
    in: ['body'],
    isString: true,
    errorMessage: errors.USER.NAME,
  },
  surname: {
    in: ['body'],
    isString: true,
    errorMessage: errors.USER.SURNAME,
  },
  email: {
    in: ['body'],
    isEmail: true,
    errorMessage: errors.USER.EMAIL,
  },
  section: {
    in: ['body'],
    isString: true,
    errorMessage: errors.USER.SECTION,
  },
};
