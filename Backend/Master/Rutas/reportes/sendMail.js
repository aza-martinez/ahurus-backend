'use strict'

var express = require('express');
var mail = require('../../Middleware/sendMail');
var router = express.Router();
var TiposPagosController = require('../../Controladores/tipos_pagos/tipos');

// Rutas útiles
router.post('/reportes/enviarCorreo', mail.sendEmail);
module.exports = router;

