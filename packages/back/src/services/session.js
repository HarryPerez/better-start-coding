const jwt = require('jsonwebtoken');

const encodeLogin = (data,
  expiresIn = process.env.JWT_EXPIRATION_TIME) => jwt.sign(
  { data }, process.env.JWT_SECRET, { expiresIn },
);

const decodeLogin = (token) => jwt.verify(token, process.env.JWT_SECRET);

const encodePasswordChange = (data, expiresIn = '600s') => jwt.sign(
  { data }, process.env.PASSWORD_CHANGE_SECRET, { expiresIn },
);

const decodePasswordChange = (token) => jwt.verify(token, process.env.PASSWORD_CHANGE_SECRET);

module.exports = {
  encodeLogin, decodeLogin, encodePasswordChange, decodePasswordChange,
};
