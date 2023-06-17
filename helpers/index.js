const nodeMailer = require("nodemailer");
require("dotenv").config();

let transporter = nodeMailer.createTransport({
  host: "mail.privateemail.com", // your SMTP server address
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        return resolve(info);
      }
    });
  });
};



module.exports = sendEmail;