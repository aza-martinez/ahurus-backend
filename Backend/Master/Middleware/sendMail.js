var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(req, res){
// Definimos el transporter
    var transporter = nodemailer.createTransport({
      host: "binary-solutions.com.mx",
      port: 465,
      auth: {
        user: "srendon@binary-solutions.com.mx",
        pass: "Jsarm270819"
      }
    });
// Definimos el email
var mailOptions = {
    from: 'srendon@binary-solutions.com.mx',
    to: 'alejandro.rendon@itcom.mx, srendon@binary-solutions.com.mx, js.alejandro.rendon.mireles@gmail.com',
    subject: 'Asunto',
    text: 'Contenido del email'
};
// Enviamos el email
transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        res.send(500, error.message);
    } else {
        console.log("Email sent");
        res.status(200).jsonp(req.body);
    }
});
};
/* 
var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1a2b3c4d5e6f7g",
    pass: "1a2b3c4d5e6f7g"
  }
});

var mailOptions = {
  from: '"Example Team" <from@example.com>',
  to: 'user1@example.com, user2@example.com',
  subject: 'Nice Nodemailer test',
  text: 'Hey there, it’s our first message sent with Nodemailer ',
  html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />',
  attachments: [
    {
      filename: 'mailtrap.png',
      path: __dirname + '/mailtrap.png',
      cid: 'uniq-mailtrap.png' 
    }
  ]
};

transport.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
}); */
