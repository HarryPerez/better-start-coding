const User = require('../../src/models/users');
const { user: defaultUser } = require('../mocks/user');
const { encrypt } = require('../../src/helpers/passwords');
const { createMany } = require('./helpers');

const createUser = async (user = defaultUser) => new User(
  { ...user, password: await encrypt(user.password) },
).save();

const createManyUsers = createMany(User, defaultUser);


module.exports = { createUser, createManyUsers };
