const nodeMailer = require("nodemailer");
require("dotenv").config();

let transporter = nodeMailer.createTransport({
  host: "smtp.privateemail.com", // your SMTP server address
  port: 465,
  secure: true, // true for 465, false for other ports
  
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages",success);
  }
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