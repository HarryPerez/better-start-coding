const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'testing') {
  mongoose.set('debug', true);
}

const initDatabase = () => {
  const {
    DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DB_PREFIX, DB_NAME_TEST,
  } = process.env;
  const DB_PER_ENV = {
    development: {
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      prefix: DB_PREFIX,
      name: DB_NAME,
      host: DB_HOST,
    },
    production: {
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      prefix: DB_PREFIX,
      name: DB_NAME,
      host: DB_HOST,
    },
    testing: {
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      prefix: DB_PREFIX,
      name: DB_NAME_TEST,
      host: DB_HOST,
    },
  };
  const {
    user,
    password,
    host,
    port,
    prefix,
    name,
  } = DB_PER_ENV[process.env.NODE_ENV];
  mongoose.connect(`${prefix}://${user ? `${user}:${password}@` : ''}${host}${port ? `:${port}` : ''}/${name}`,
    { useNewUrlParser: true, useUnifiedTopology: true, authSource: 'admin' });
  return mongoose;
};

module.exports = { initDatabase, mongoose, schema: mongoose.Schema };
