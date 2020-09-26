const pino = require('pino');
const prettifier = require('pino-pretty');

const { NODE_ENV } = process.env;

const log = pino({
  prettyPrint: {
    levelFirst: true,
    translateTime: true,
  },
  prettifier,
});


const error = () => {};
const mockLog = () => {};

module.exports = NODE_ENV !== 'testing' ? log : ({ info: mockLog, error });
