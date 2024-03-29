const nodemailer = require('nodemailer');
const transporter = require('./transporter');


const sendMail = async(to, subject, html, dir, callback)=>{
    const message = {
        from: process.env.userGMail, // Sender address
        to: to,         // List of recipients
        subject: subject, // Subject line
        html: html,
        attachments: [
          {
              filename: dir,
              path: 'src/pdf/'+dir
          }
      ]
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

module.exports = sendMail;