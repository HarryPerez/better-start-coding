const bcrypt = require('bcryptjs');

const SALT_ROUND = 10;

const encrypt = (password) => bcrypt.hash(password, SALT_ROUND);

const compare = (received, saved) => bcrypt.compare(received, saved);

module.exports = { encrypt, compare };
