const AWS = require('aws-sdk-mock');

const sesStub = (spy) => AWS.mock('SES', 'sendEmail', spy);

const sesRestore = () => AWS.restore('SES');

module.exports = { sesStub, sesRestore };
