/* eslint-disable no-undef */
/* eslint-disable global-require */

const request = require('supertest');

describe('Test the start app', () => {
  test('It should response the GET method in testing mode', async () => {
    const app = require('../src/app');
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
  });

  test.skip('It should response the GET method in production mode', async () => {
    process.env.NODE_ENV = 'production';
    const app = require('../src/app');
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
  });
});
