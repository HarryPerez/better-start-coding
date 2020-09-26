const sanitize = require('mongo-sanitize');
const {
  invalidMongoIdError,
} = require('../errors');
const { catchRequest } = require('../helpers/request');

module.exports = (req, res, next) => {
  sanitize(req.query);
  if (req.params.id && !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return catchRequest({ err: invalidMongoIdError(req.params.id, '1038'), res });
  }
  return next();
};
