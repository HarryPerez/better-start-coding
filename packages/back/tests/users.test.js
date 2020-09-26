/* eslint-disable no-undef */
/* eslint-disable global-require */

const { authRequest, generateToken } = require('./helpers/request');

const { user, updatedUser } = require('./mocks/user');
const { createUser, createManyUsers } = require('./factories/users');
const { dropCollections } = require('./helpers/db');
const { COLLECTIONS } = require('./helpers/constants');
const User = require('../src/models/users');
const { initDatabase, mongoose } = require('../src/db');

let adminToken;
let token;

describe('users controller', () => {
  beforeAll(async () => {
    initDatabase();
    require('dotenv').config();
    await dropCollections(COLLECTIONS);
    token = await generateToken();
    adminToken = await generateToken('admin@hi.com', 'admin');
  });
  afterEach((async () => {
    await dropCollections(COLLECTIONS);
    token = await generateToken();
    adminToken = await generateToken('admin@hi.com', 'admin');
  }));
  afterAll(async () => {
    await mongoose.connection.close();
  });
  describe('create user', () => {
    test('It should have a successful response', async () => {
      const response = await authRequest(adminToken, 'post', '/users', { ...user, email: 'hey@hi.com' });
      expect(response.statusCode).toBe(201);
      expect(response.body.email).toEqual('hey@hi.com');
      const userInDb = await User.findOne({ email: response.body.email });
      expect(userInDb.name).toEqual(user.name);
      expect(userInDb.surname).toEqual(user.surname);
      expect(userInDb.section).toEqual(user.section);
      expect(userInDb.role).toEqual(user.role);
    });
    test('It fail because name is not present', async () => {
      const userWithoutField = { ...user };
      delete userWithoutField.name;
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0032');
      expect(response.body[0].message).toBe('name must be present and should be a string');
    });
    test('It fail because surname is not present', async () => {
      const userWithoutField = { ...user };
      delete userWithoutField.surname;
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0033');
      expect(response.body[0].message).toBe('surname must be present and should be a string');
    });
    test('It fail because email is not present', async () => {
      const userWithoutField = { ...user };
      delete userWithoutField.email;
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0034');
      expect(response.body[0].message).toBe('email must be present and should be valid');
    });
    test('It fail because section is not present', async () => {
      const userWithoutField = { ...user };
      delete userWithoutField.section;
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0036');
      expect(response.body[0].message).toBe('section must be present and should be a string');
    });
    test('It fail because email is not valid', async () => {
      const userWithoutField = { ...user };
      userWithoutField.email = 'FAKE_VALUE';
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0034');
      expect(response.body[0].message).toBe('email must be present and should be valid');
    });
    test('It fail because name is not valid', async () => {
      const userWithoutField = { ...user };
      userWithoutField.name = 8;
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0032');
      expect(response.body[0].message).toBe('name must be present and should be a string');
    });
    test('It fail because surname is not valid', async () => {
      const userWithoutField = { ...user };
      userWithoutField.surname = 8;
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0033');
      expect(response.body[0].message).toBe('surname must be present and should be a string');
    });
    test('It fail because section is not valid', async () => {
      const userWithoutField = { ...user };
      userWithoutField.section = 8;
      const response = await authRequest(adminToken, 'post', '/users', userWithoutField);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('0036');
      expect(response.body[0].message).toBe('section must be present and should be a string');
    });
    test('It fail because user already exists', async () => {
      await createUser(user);
      const response = await authRequest(adminToken, 'post', '/users', user);
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('1031');
      expect(response.body[0].message).toBe('The user with email hi@hi.com already exists');
    });
  });
  describe('get user', () => {
    test('it should get the user correctly', async () => {
      await createUser();
      token = await generateToken();
      const response = await authRequest(token, 'get', '/me');
      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toEqual(user.email);
      expect(response.body.user.name).toEqual(user.name);
      expect(response.body.user.surname).toEqual(user.surname);
      expect(response.body.user.role).toEqual(user.role);
      expect(response.body.user.section).toEqual(user.section);
    });
    test('it should get the user correctly as admin', async () => {
      const response = await authRequest(adminToken, 'get', '/me');
      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toEqual('admin@hi.com');
      expect(response.body.user.name).toEqual(user.name);
      expect(response.body.user.surname).toEqual(user.surname);
      expect(response.body.user.role).toEqual('admin');
      expect(response.body.user.section).toEqual(user.section);
    });
  });
  describe('get user by id', () => {
    test('it should get the user correctly as admin', async () => {
      const { id } = await createUser();
      const response = await authRequest(adminToken, 'get', `/users/${id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toEqual(user.email);
      expect(response.body.user.name).toEqual(user.name);
      expect(response.body.user.surname).toEqual(user.surname);
      expect(response.body.user.role).toEqual(user.role);
      expect(response.body.user.section).toEqual(user.section);
    });
    test('It should fail because the id does not exist', async () => {
      const response = await authRequest(adminToken, 'get', '/users/41224d776a326fb40f000001');
      expect(response.statusCode).toBe(404);
      expect(response.body[0].internal_code).toBe('1040');
      expect(response.body[0].message).toEqual('The user with id 41224d776a326fb40f000001 was not found');
    });
    test('It should fail because the id is invalid', async () => {
      const response = await authRequest(adminToken, 'get', '/users/asd');
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('1038');
      expect(response.body[0].message).toEqual('Invalid id asd');
    });
  });
  describe('get users', () => {
    beforeAll(async () => {
      await dropCollections(['users']);
      adminToken = await generateToken('admin@hi.com', 'admin');
    });
    afterEach((async () => {
      await dropCollections(['users']);
      adminToken = await generateToken('admin@hi.com', 'admin');
    }));
    test('It should get the users', async () => {
      await createUser();
      const response = await authRequest(adminToken, 'get', '/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
    });
    test('It should get the users with limit', async () => {
      await createManyUsers(5);
      const response = await authRequest(adminToken, 'get', '/users?[users][limit]=2');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
    test('It should bring the correct number of users', async () => {
      await createManyUsers(5);
      const response = await authRequest(adminToken, 'get', '/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(7); // 5 + 2 created in before each
    });
    test('It should bring the correct user filtered by name', async () => {
      await createManyUsers(5);
      const name = 'MY_USER';
      await createUser({ ...user, name });
      const response = await authRequest(adminToken, 'get', '/users?users[filter][name]=MY_USER');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe(name);
    });
    test('It should bring the correct users filtered by surname', async () => {
      await createManyUsers(10);
      const surname = 'gonza';
      await Promise.all(new Array(5).fill(0).map(() => createUser({ ...user, surname })));
      const response = await authRequest(adminToken, 'get', '/users?users[filter][surname]=gonza');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(5);
      expect(response.body[0].surname).toBe(surname);
    });
    test('It should bring the correct users filtered by email', async () => {
      await createManyUsers(25);
      const email = 'asd@asd.com';
      await Promise.all(new Array(8).fill(0).map(() => createUser({ ...user, email })));
      const response = await authRequest(adminToken, 'get', '/users?users[filter][email]=asd@asd.com');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(8);
      expect(response.body[0].email).toBe(email);
    });
    test('It should bring the correct users filtered by user section', async () => {
      await createManyUsers(12);
      const section = 'special';
      await Promise.all(new Array(2).fill(0).map(() => createUser({ ...user, section })));
      const response = await authRequest(adminToken, 'get', '/users?users[filter][section]=special');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].section).toBe(section);
    });
    test('It should bring the correct users filtered by user role', async () => {
      await createManyUsers(12);
      const role = 'other';
      await Promise.all(new Array(2).fill(0).map(() => createUser({ ...user, role })));
      const response = await authRequest(adminToken, 'get', '/users?users[filter][role]=other');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].role).toBe(role);
    });
    test('It should bring the correct users ordered by user name asc', async () => {
      await createManyUsers(2);
      await Promise.all([createUser({ ...user, name: 'aaaa' }),
        createUser({ ...user, name: 'aa' }),
        createUser({ ...user, name: 'a' })]);
      const response = await authRequest(adminToken, 'get', '/users?users[sort][name]=asc');
      expect(response.statusCode).toBe(200);
      expect(response.body[0].name).toBe('a');
      expect(response.body[1].name).toBe('aa');
      expect(response.body[2].name).toBe('aaaa');
    });
    test('It should bring the correct users ordered by user type desc', async () => {
      await createManyUsers(1);
      await Promise.all([createUser({ ...user, name: 'm' }),
        createUser({ ...user, name: 'z' }),
        createUser({ ...user, name: 'x' })]);
      const response = await authRequest(adminToken, 'get', '/users?users[sort][name]=desc');
      expect(response.statusCode).toBe(200);
      expect(response.body[0].name).toBe('z');
      expect(response.body[1].name).toBe('x');
      expect(response.body[2].name).toBe('m');
    });
    test('It should bring the correct users filtered by any value if string', async () => {
      await createManyUsers(4);
      await Promise.all([createUser({ ...user, name: 'ANY' }),
        createUser({ ...user, surname: 'AnY' }),
        createUser({ ...user, role: 'any' })]);
      const response = await authRequest(adminToken, 'get', '/users?users[filter][any]=any');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
    });
    test('It should bring the correct users filtered by any value with Ilike', async () => {
      await createManyUsers(2);
      await createUser({ ...user, name: 'ASDFGH' });
      const response = await authRequest(adminToken, 'get', '/users?users[filter][any]=fgh');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('ASDFGH');
    });
    test('It should bring the correct users filtered by date with greater and lower', async () => {
      await createManyUsers(3);
      await Promise.all([createUser({ ...user, createdAt: '2019-03-16T01:34:04.647Z' }),
        createUser({ ...user, createdAt: '2019-03-17T01:34:04.647Z' })]);
      const response = await authRequest(adminToken, 'get', '/users?users[filter][createdAt][gte]=2019-03-15&users[filter][createdAt][lt]=2019-03-18');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].createdAt).toBe('2019-03-17T01:34:04.647Z');
      expect(response.body[1].createdAt).toBe('2019-03-16T01:34:04.647Z');
    });
  });
  describe('delete user', () => {
    test('It should delete the user', async () => {
      const { id } = await createUser();
      const response = await authRequest(adminToken, 'delete', `/users/${id}`);
      expect(response.statusCode).toBe(204);
      const find = await User.findById(id);
      expect(find).toEqual(null);
    });
    test('It should fail because the user does not exist', async () => {
      const response = await authRequest(adminToken, 'delete', '/users/41224d776a326fb40f000001');
      expect(response.statusCode).toBe(404);
      expect(response.body[0].internal_code).toBe('1036');
      expect(response.body[0].message).toEqual('The user with id 41224d776a326fb40f000001 was not found');
    });
    test('It should fail because the id is invalid', async () => {
      const response = await authRequest(adminToken, 'delete', '/users/asd');
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('1038');
      expect(response.body[0].message).toEqual('Invalid id asd');
    });
  });
  describe('update user', () => {
    test('It should update the user correctly', async () => {
      const { id } = await createUser();
      const response = await authRequest(adminToken, 'put', `/users/${id}`, { ...updatedUser });
      expect(response.statusCode).toBe(201);
      const dbUser = await User.findById(id);
      Object.keys(updatedUser).forEach((field) => {
        expect(dbUser[field]).toEqual(updatedUser[field]);
      });
    });
    test('It should update the user correctly with only one field', async () => {
      const { id } = await createUser();
      const response = await authRequest(adminToken, 'put', `/users/${id}`, { name: 'ANOTHER' });
      expect(response.statusCode).toBe(201);
      const dbUser = await User.findById(id);
      expect(dbUser.name).toEqual('ANOTHER');
    });
    test('It should fail because the id does not exist', async () => {
      const response = await authRequest(adminToken, 'put', '/users/41224d776a326fb40f000001', { surname: 'ANOTHER' });
      expect(response.statusCode).toBe(404);
      expect(response.body[0].internal_code).toBe('1035');
      expect(response.body[0].message).toEqual('The user with id 41224d776a326fb40f000001 was not found');
    });
    test('It should fail because the id is invalid', async () => {
      const response = await authRequest(adminToken, 'put', '/users/asd', { surname: 'ANOTHER' });
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('1038');
      expect(response.body[0].message).toEqual('Invalid id asd');
    });
    test('It should fail because body has invalid keys', async () => {
      const { id } = await createUser();
      const response = await authRequest(adminToken, 'put', `/users/${id}`, { invalidKey: 'invalid' });
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('1035');
      expect(response.body[0].message).toEqual('There are invalid fields in body');
    });
    test('It should fail because body has invalid keys: password', async () => {
      const { id } = await createUser();
      const response = await authRequest(adminToken, 'put', `/users/${id}`, { password: 'invalid' });
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('1035');
      expect(response.body[0].message).toEqual('There are invalid fields in body: password or email cannot be updated');
    });
    test('It should fail because body has invalid keys: password', async () => {
      const { id } = await createUser();
      const response = await authRequest(adminToken, 'put', `/users/${id}`, { email: 'invalid@fake.com' });
      expect(response.statusCode).toBe(400);
      expect(response.body[0].internal_code).toBe('1035');
      expect(response.body[0].message).toEqual('There are invalid fields in body: password or email cannot be updated');
    });
  });
});
