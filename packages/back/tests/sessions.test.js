/* eslint-disable no-undef */
/* eslint-disable global-require */

const sinon = require('sinon');

const { request, authRequest, generateToken } = require('./helpers/request');
const { user } = require('./mocks/user');
const { createUser } = require('./factories/users');
const { dropCollections } = require('./helpers/db');
const { COLLECTIONS } = require('./helpers/constants');
const { decodeLogin: decode } = require('../src/services/session');
const { sesStub, sesRestore } = require('./mocks/aws');
const { initDatabase, mongoose } = require('../src/db');

describe('sessions', () => {
  beforeAll(async () => {
    require('dotenv').config();
    initDatabase();
    await dropCollections([COLLECTIONS]);
  });
  afterEach((async () => {
    await dropCollections(COLLECTIONS);
  }));
  afterAll(async () => {
    await mongoose.connection.close();
  });
  describe('sign in', () => {
    describe('existing user', () => {
      test('It should have a successful response signing in', async () => {
        await createUser();
        const response = await request()
          .post('/sign_in')
          .send({ email: user.email, password: user.password });
        expect(response.statusCode).toBe(200);
        expect(response.body.expirationTime).toBe('1h');
        const { token } = response.body;
        const email = await decode(token).data;
        expect(email).toEqual(user.email);
      });
      test('It should have a successful response signing in as admin', async () => {
        await createUser({ ...user, email: 'admin@admin.com', role: 'admin' });
        const response = await request()
          .post('/sign_in')
          .send({ email: 'admin@admin.com', password: user.password, admin: true });
        expect(response.statusCode).toBe(200);
        expect(response.body.expirationTime).toBe('1h');
        const { token } = response.body;
        const email = await decode(token).data;
        expect(email).toEqual('admin@admin.com');
      });
      test('It should fail because of wrong email', async () => {
        await createUser();
        const response = await request()
          .post('/sign_in')
          .send({ email: 'fake@fake.com', password: user.password });
        expect(response.statusCode).toBe(404);
        expect(response.body[0].message).toBe('The user with email fake@fake.com was not found');
        expect(response.body[0].internal_code).toBe('1032');
      });
      test('It should fail because of wrong password', async () => {
        await createUser();
        const response = await request()
          .post('/sign_in')
          .send({ email: user.email, password: '1234' });
        expect(response.statusCode).toBe(404);
        expect(response.body[0].message).toBe('The user with email hi@hi.com was not found');
        expect(response.body[0].internal_code).toBe('1032');
      });
      test('It should fail because of trying to login as admin', async () => {
        await createUser();
        const response = await request()
          .post('/sign_in')
          .send({ email: user.email, password: user.password, admin: true });
        expect(response.statusCode).toBe(404);
        expect(response.body[0].message).toBe('The user with email hi@hi.com was not found');
        expect(response.body[0].internal_code).toBe('1032');
      });
      test('It should fail because of no email was sent', async () => {
        await createUser();
        const response = await request()
          .post('/sign_in')
          .send({ password: user.password });
        expect(response.statusCode).toBe(400);
        expect(response.body[0].message).toBe('email must be present and should be valid');
        expect(response.body[0].internal_code).toBe('0034');
      });
      test('It should fail because of no password was sent', async () => {
        await createUser();
        const response = await request()
          .post('/sign_in')
          .send({ email: user.email });
        expect(response.statusCode).toBe(400);
        expect(response.body[0].message).toBe('password must be present and should be a string');
        expect(response.body[0].internal_code).toBe('0035');
      });
    });
    describe('new user', () => {
      let spy;
      beforeEach(async () => {
        spy = sinon.spy();
        sesStub(spy);
      });
      afterEach((async () => {
        sesRestore();
      }));
      test('It should send email if the user is new', async () => {
        await createUser({ ...user, email: 'new@zerf.com.ar', active: false });
        const response = await request()
          .post('/sign_in')
          .send({ email: 'new@zerf.com.ar', password: '' });
        expect(response.statusCode).toBe(204);
        expect(spy.calledOnce).toBe(true);
      });
    });
  });
  describe('authenticated routes', () => {
    describe('user routes', () => {
      test('It should be authenticated as user if ask for actives details', async () => {
        const response = await request().get('/me');
        expect(response.statusCode).toBe(401);
        expect(response.body[0].message).toBe('No token was set');
        expect(response.body[0].internal_code).toBe('2000');
      });
    });
    describe('admin routes', () => {
      test('It should be authenticated as admin if ask for get users using user token', async () => {
        await createUser();
        const token = await generateToken();
        const response = await authRequest(token, 'post', '/users');
        expect(response.statusCode).toBe(403);
        expect(response.body[0].message).toBe('User \'hi@hi.com\' is not Admin');
        expect(response.body[0].internal_code).toBe('2005');
      });
      test('It should be authenticated as admin if ask for updating users using user token', async () => {
        await createUser();
        const token = await generateToken();
        const response = await authRequest(token, 'put', '/users/asd');
        expect(response.statusCode).toBe(403);
        expect(response.body[0].message).toBe('User \'hi@hi.com\' is not Admin');
        expect(response.body[0].internal_code).toBe('2005');
      });
      test('It should be authenticated as admin if ask for deleting users using user token', async () => {
        await createUser();
        const token = await generateToken();
        const response = await authRequest(token, 'delete', '/users/asd');
        expect(response.statusCode).toBe(403);
        expect(response.body[0].message).toBe('User \'hi@hi.com\' is not Admin');
        expect(response.body[0].internal_code).toBe('2005');
      });
      test('It should be authenticated as admin if ask for create users', async () => {
        const response = await request().post('/users');
        expect(response.statusCode).toBe(401);
        expect(response.body[0].message).toBe('No token was set');
        expect(response.body[0].internal_code).toBe('2000');
      });
      test('It should be authenticated as admin if ask for getting users', async () => {
        const response = await request().get('/users');
        expect(response.statusCode).toBe(401);
        expect(response.body[0].message).toBe('No token was set');
        expect(response.body[0].internal_code).toBe('2000');
      });
      test('It should be authenticated as admin if ask for getting user by id', async () => {
        const response = await request().get('/users/1');
        expect(response.statusCode).toBe(401);
        expect(response.body[0].message).toBe('No token was set');
        expect(response.body[0].internal_code).toBe('2000');
      });
      test('It should be authenticated as admin if ask for edit users', async () => {
        const response = await request().put('/users/asd');
        expect(response.statusCode).toBe(401);
        expect(response.body[0].message).toBe('No token was set');
        expect(response.body[0].internal_code).toBe('2000');
      });
      test('It should be authenticated as admin if ask for delete users', async () => {
        const response = await request().delete('/users/asd');
        expect(response.statusCode).toBe(401);
        expect(response.body[0].message).toBe('No token was set');
        expect(response.body[0].internal_code).toBe('2000');
      });
    });
  });
});
