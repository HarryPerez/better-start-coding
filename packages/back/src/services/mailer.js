const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

/* eslint-disable no-unused-vars */
const sendEmail = ({
  to, cc = [], subject, raw, html,
}) => new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail({
  Destination: {
    CcAddresses: [
      ...cc,
    ],
    ToAddresses: to,
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: html,
      },
      Text: {
        Charset: 'UTF-8',
        Data: raw,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: subject,
    },
  },
  Source: process.env.MAIL_SENDER,
}).promise();

module.exports = { sendEmail };
