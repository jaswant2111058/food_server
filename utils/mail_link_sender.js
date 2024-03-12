const nodemailer = require("nodemailer")

function sendmail(username,email,token) {
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "jkstar0123@gmail.com",
      pass: process.env.EMAIL_PASS,
    }
  })
  var mailOptions = {
    from: 'jkstar0123@gmail.com',
    to: `${email}`,
    subject: 'registor email verification',
    html: `<html><a href="${process.env.ORIGIN}/email/verification?token=${token}&username=${username}&email=${email}">Verify</a> </html>`
  }
  console.log(mailOptions)
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}
module.exports = sendmail;