const nodemailer = require('nodemailer');

export const mailSender = {
  sendGmail: function(param) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      prot: 587,
      host: "smtp.gmlail.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_PASSWORD,
      }
    });

    var mailOptions = {
      from: process.env.GOOGLE_MAIL,
      to: param.toEmail,
      subject: param.subject, 
      text: param.text 
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};