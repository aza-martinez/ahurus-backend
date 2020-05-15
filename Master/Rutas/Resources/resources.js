'use strict';

var express = require('express');
var resourcesController = require('../../Controladores/resources/resources');
var router = express.Router();

// Rutas útiles
router.get('/bancos/listar/', resourcesController.getBancos);
router.get('/tiposPago/listar/', resourcesController.getTipos);

module.exports = router;
