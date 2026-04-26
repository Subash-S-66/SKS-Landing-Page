const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this based on SMTP settings
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
