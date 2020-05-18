'use strict'

var express = require('express');
var sendCorreoController = require('../../Controladores/reportes/enviarCorreo');

var router = express.Router();

// Rutas útiles
router.get('/reportes/enviarCorreo',  sendCorreoController.transporter.sendMail);

module.exports = router;