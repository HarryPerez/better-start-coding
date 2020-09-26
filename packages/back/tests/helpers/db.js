const { mongoose } = require('../../src/db');

const dropCollections = (collections) => {
  const promises = [];
  collections.forEach(async (collection) => {
    if (mongoose.connection.collections[collection]) {
      promises.push(mongoose.connection.collections[collection].drop().catch(
        (err) => (err.message === 'ns not found' ? Promise.resolve() : Promise.reject(err)),
      ));
    }
  });
  return Promise.all(promises);
};

module.exports = { dropCollections };
