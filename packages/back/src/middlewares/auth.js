
const { decodeLogin, decodePasswordChange } = require('../services/session');
const User = require('../models/users');
const { catchRequest } = require('../helpers/request');
const {
  unauthorizedUser, forbiddenUser, JWT_ERRORS,
} = require('../errors');

const authenticate = async (req, res, next, decode) => {
  const authHeader = req.headers[process.env.JWT_HEADER_NAME];
  if (!authHeader) return catchRequest({ err: unauthorizedUser('No token was set', '2000'), res });
  const authSplitted = authHeader.split(' ');
  if (authSplitted[0] !== 'Bearer') return catchRequest({ err: unauthorizedUser('Bad header token', '2001'), res });
  const token = authSplitted[1];
  if (!token) return catchRequest({ err: unauthorizedUser('Bad header token', '2002'), res });
  try {
    const email = await decode(token).data;
    const user = await User.findOne({ email }).select({ password: 0 });
    if (!user) return catchRequest({ err: unauthorizedUser('No user found', '2003'), res });
    req.user = user;
    return next();
  } catch (error) {
    return error && error.message && JWT_ERRORS[error.message]
      ? catchRequest(JWT_ERRORS[error.message](res))
      : catchRequest({ err: error, res, internalCode: '2006' });
  }
};

const authenticateUser = (req, res, next) => authenticate(
  req, res, next, decodeLogin,
);
const authenticatePasswordChange = (req, res, next) => authenticate(
  req, res, next, decodePasswordChange,
);

const isAdmin = (req, res, next) => {
  const { user } = req;
  if (user.role === 'admin') {
    return next();
  }
  return catchRequest({ err: forbiddenUser(`User '${user.email}' is not Admin`, '2005'), res });
};

module.exports = { authenticateUser, authenticatePasswordChange, isAdmin };
