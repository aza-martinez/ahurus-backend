'use strict'
var express = require('express');
var EstadosController = require('../../Controladores/transferencias/cambiosEstados');


var router = express.Router();

router.put('/transferencia/CambioEstado/:id?', EstadosController.update);

module.exports = router;