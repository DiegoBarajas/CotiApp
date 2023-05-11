const nodemailer = require('nodemailer');
const transporter = require('./transporter');

const sendTextMail = async(to, subject, html, callback)=>{
    const message = {
        from: process.env.userGMail, // Sender address
        to: to,         // List of recipients
        subject: subject, // Subject line
        html: html
    };
    
    await transporter.sendMail(message, function(err, info) {
        if (err) {
          console.log(err.stack);
          callback(false);
        } else {
          console.log(info);
          callback(true);
        }
    });

}

module.exports = sendTextMail;