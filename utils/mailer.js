const nodemailer = require("nodemailer");

const sendEmail = async (mailBody) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const response = await transporter.sendMail({
    from: process.env.MAILER_EMAIL,
    to: mailBody.to,
    subject: mailBody.subject,
    text: mailBody.text,
    html: mailBody.html,
  });
  return response;
};

module.exports = { sendEmail };
