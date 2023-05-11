const nodemailer = require('nodemailer');

/*const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.userGMail,
      pass: process.env.passGMail,
      
    }
});*/

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2cdfed175fedf0",
      pass: "a70214760987f5"
    }
  });

module.exports = transporter;