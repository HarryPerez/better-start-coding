const { mongoose } = require('../db');

module.exports = (_, res) => res.status(200)
  .send({ uptime: process.uptime(), mongo: mongoose.STATES[mongoose.connection.readyState] });
