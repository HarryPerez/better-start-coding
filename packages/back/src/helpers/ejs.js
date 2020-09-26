const ejs = require('ejs');

const renderFile = (filename, data, options) => new Promise((resolve, reject) => ejs.renderFile(
  filename, data, options, (err, str) => {
    if (err) reject(err);
    return resolve(str);
  },
));

module.exports = { renderFile };
