const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD, 
  },
});

const sendEmail = (email, subject, text) => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info.response);
        }
      });
    });
  };

module.exports = sendEmail;
