const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email.
 * @param {Object} options
 * @param {string} options.to - Recipient email.
 * @param {string} options.subject - Subject line.
 * @param {string} options.html - HTML body.
 * @param {string} [options.text] - Optional text body.
 * @param {string} [options.from] - Optional from address.
 */
async function sendMail({ to, subject, html, text, from }) {
  return transporter.sendMail({
    from: from || `"Team - Nextstop:Haramain" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

module.exports = sendMail;