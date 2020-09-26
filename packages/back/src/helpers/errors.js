const logger = require('../logger');

const swallowError = ({ err, message }) => {
  logger.error(message);
  logger.error(err);
  return Promise.resolve();
};

// eslint-disable-next-line prefer-promise-reject-errors
const handleError = ({ err, message, code }) => Promise.reject({
  message,
  code,
  err,
});

module.exports = { swallowError, handleError };
