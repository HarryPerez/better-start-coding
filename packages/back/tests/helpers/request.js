const supertest = require('supertest');
const app = require('../../src/app');
const { user } = require('../mocks/user');
const { createUser } = require('../factories/users');

const request = () => supertest(app);

const generateToken = async (email = 'hi@hi.com', role = 'user') => {
  await createUser({ ...user, role, email });
  return supertest(app)
    .post('/sign_in')
    .send({ email, password: user.password, admin: role === 'admin' })
    .then((res) => res.body.token);
};

const authRequest = async (token, method, path, body = {}) => supertest(app)[method](path).set('authorization', `Bearer ${token}`)
  .set('Accept', 'application/json')
  .send(body);

const insertData = (body, endpoint) => supertest(app)
  .post(endpoint)
  .set('Accept', 'application/json')
  .send(body);

const apiRequest = async (key, method, path, body = {}) => supertest(app)[method](path).set('x-api-key', key)
  .set('Accept', 'application/json')
  .send(body);

module.exports = {
  authRequest, request, generateToken, insertData, apiRequest,
};
