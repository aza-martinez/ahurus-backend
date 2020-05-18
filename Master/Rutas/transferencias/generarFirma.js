'use strict'
var express = require('express');
var GeneradorController = require('../../Controladores/transferencias/generadorFirma');


var router = express.Router();
router.post('/transferencias/generarFirma/:?', GeneradorController.generar);

module.exports = router;