const nodemailer = require('nodemailer');

export const mailSender = {
  sendNmail: function(param) {
    var transporter = nodemailer.createTransport({
      service: "Naver",
      prot: 587,
      host: "smtp.naver.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NAVER_MAIL,
        pass: process.env.NAVER_PASSWORD,
      }
    });

    var mailOptions = {
      from: process.env.NAVER_MAIL,
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