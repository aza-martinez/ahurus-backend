'use strict'

var express = require('express');
var EstadosController = require('../../Controladores/estados/estados');
var auth0 = require('../../Middleware/auth0');

var router = express.Router();

/* // Rutas útiles
router.post('/centros/guardar', PlazasController.save);
router.get('/centros/listar/:last?', PlazasController.getCentros);
router.get('/centros/buscar/:id', PlazasController.getCentro); */

module.exports = router;