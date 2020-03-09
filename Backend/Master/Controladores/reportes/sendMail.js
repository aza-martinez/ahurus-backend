
var validator = require('validator');
var Usuario = require('../../Modelos/usuarios/usuarios');
var auth = require('../../Controladores/usuarios/auth');
var moment = require('moment');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var controller = {
    buscarUsuario: (req, res) => {
        var id = req.params.id;
        Usuario.find({'_id':id})
            .exec((err, usuario) => {
                if (err) {
                    return res.status(500).send({});
                }
                if (!usuario || usuario.length <= 0) {}
                console.log(usuario);
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
                      return res.status(200).send('Email Mandado Correctamente A: ')
                  }
              });
            });
    }




};
module.exports = controller;