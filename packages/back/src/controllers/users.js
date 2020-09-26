const User = require('../models/users');
const { endRequest, catchRequest } = require('../helpers/request');
const { encrypt, compare } = require('../helpers/passwords');
const { includes } = require('../helpers/array');
const { getModelFields } = require('../helpers/mongo');
const { entityAlreadyExists, entityNotFound, invalidKeys } = require('../errors');
const { encodeLogin: encode, encodePasswordChange } = require('../services/session');
const { forgotPasswordEmail } = require('../mailers/forgotPassword');
const { buildQuery } = require('../helpers/mongo');
const mapUser = require('../mappers/users');
const logger = require('../logger');

const passwordFlow = async (email, res) => {
  const user = await User.findOne({ email });
  if (!user) return endRequest({ response: {}, code: 204, res });
  const token = await encodePasswordChange(user.email);
  const resetLink = `${process.env.FRONTEND_URL}/recover?token=${token}`;
  endRequest({ response: {}, code: 204, res });
  return forgotPasswordEmail([user.email], { resetLink })
    .catch((err) => {
      logger.error(err);
    });
};

const saveUser = async (req, res) => {
  const user = new User({ ...req.body, role: 'user' });
  const exists = await User.findOne({ email: user.email });
  if (exists) return catchRequest({ err: entityAlreadyExists(`email ${user.email}`, 'user', '1031'), res });
  user.active = false;
  return user.save()
    .then((response) => endRequest({
      response: {
        email: response.email,
      },
      code: 201,
      res,
    }))
    .catch((err) => catchRequest({
      err, res, message: 'Error saving User', internalCode: '1031',
    }));
};

const signIn = async (req, res) => {
  const { email, password, admin } = req.body;
  const user = await User.findOne({ email, role: admin ? 'admin' : 'user' });
  if (!user) return catchRequest({ err: entityNotFound(`email ${email}`, 'user', '1032'), res });
  if (!user.active) return passwordFlow(email, res);
  const valid = await compare(password, user.password);
  if (!valid) return catchRequest({ err: entityNotFound(`email ${email}`, 'user', '1032'), res });
  const payload = await encode(user.email);
  res.set('authorization', payload);
  logger.info(`User ${user.email} signed in`);
  return endRequest({
    response: {
      expirationTime: process.env.JWT_EXPIRATION_TIME,
      token: payload,
    },
    code: 200,
    res,
  });
};

const getUser = async (req, res) => {
  const { user } = req;
  return endRequest({
    response: {
      user: mapUser(user),
    },
    code: 200,
    res,
  });
};

const getUserById = async (req, res) => User.findById(req.params.id)
  .then((user) => {
    if (!user) return catchRequest({ err: entityNotFound(`id ${req.params.id}`, 'user', '1040'), res });
    return endRequest({
      response: {
        user: mapUser(user),
      },
      code: 200,
      res,
    });
  });

const changePasswordFlow = (req, res) => {
  const { email } = req.body;
  logger.info(`Email ${email} requested password change`);
  return passwordFlow(email, res);
};

const updatePassword = async (req, res) => {
  const { user } = req;
  const { password } = req.body;
  user.password = await encrypt(password);
  user.active = true;
  logger.info(`${user.email} password recovery success`);
  return user.save()
    .then((response) => endRequest({
      response: {
        email: response.email,
      },
      code: 201,
      res,
    }))
    .catch((err) => catchRequest({
      err, res, message: 'Error updating password', internalCode: '1034',
    }));
};

const getUsers = ({ query }, res) => buildQuery(User, query, {}, { updatedAt: -1 }, 100)
  .then((users) => endRequest({ response: users.map(mapUser), code: 200, res }))
  .catch((err) => catchRequest({
    err, res, message: 'Error getting users', internalCode: '1037',
  }));

const updateUser = (req, res) => User.findById(req.params.id)
  .then((user) => {
    if (!user) return catchRequest({ err: entityNotFound(`id ${req.params.id}`, 'user', '1035'), res });
    if (req.body.password || req.body.email) {
      return catchRequest({
        err: invalidKeys('There are invalid fields in body: password or email cannot be updated', '1035'),
        res,
      });
    }
    if (!includes(Object.keys(req.body), getModelFields(User))) {
      return catchRequest({
        err: invalidKeys('There are invalid fields in body', '1035'),
        res,
      });
    }
    Object.keys(req.body).forEach((field) => {
    // eslint-disable-next-line no-param-reassign
      user[field] = req.body[field];
    });
    return user.save().then((response) => endRequest({
      response: {
        email: response.email,
      },
      code: 201,
      res,
    }));
  })
  .catch((err) => catchRequest({
    err, res, message: 'Error updating user', internalCode: '1035',
  }));

const deleteUser = (req, res) => User.findById(req.params.id)
  .then((user) => {
    if (!user) return catchRequest({ err: entityNotFound(`id ${req.params.id}`, 'user', '1036'), res });
    return user.remove().then(() => endRequest({
      res,
      code: 204,
    }));
  });

module.exports = {
  saveUser,
  signIn,
  getUser,
  changePasswordFlow,
  updatePassword,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
};
