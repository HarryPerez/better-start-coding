/* eslint-disable global-require */

const logger = require('./src/logger');

try {
  const app = require('./src/app');
  app.listen(process.env.PORT);
  logger.info(`Listening on port ${process.env.PORT}`);
} catch (error) {
  logger.error(error);
}
