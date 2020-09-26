const path = require('path');

const { sendEmail } = require('../services/mailer');
const { renderFile } = require('../helpers/ejs');

const forgotPasswordEmail = async (to, { resetLink }) => {
  const html = await renderFile(path.resolve('src/mailers/templates/forgotPassword.ejs'), { to, resetLink, bucketUrl: process.env.BUCKET_URL });
  return sendEmail({
    to,
    subject: 'WelTel: cambio de contraseña',
    raw: `Si solicitaste un cambio de contraseña para tu usuario ${to}, podes hacerlo entrando en el siguiente link: ${resetLink}`,
    html,
  });
};

module.exports = { forgotPasswordEmail };
