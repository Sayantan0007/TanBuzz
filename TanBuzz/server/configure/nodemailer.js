const nodemailer = require("nodemailer");

// Create a transporter using Ethereal test credentials.
// creaate a transporter object using smtp transport with the following configuration:
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send an email using async/await
const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL, // Sender's email address
    to,
    subject,
    html: body,
  });
  return response;
};
module.exports = sendEmail;
