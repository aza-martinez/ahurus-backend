'use strict'

var express = require('express');
var devolucionesController = require('../../Controladores/devoluciones/devoluciones');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/devoluciones/guardar',[auth0, userProfile],  devolucionesController.save);
router.get('/devoluciones/listar/:last?',[auth0, userProfile],  devolucionesController.getDevoluciones);
router.get('/devoluciones/buscar/:id',[auth0, userProfile],  devolucionesController.getDevolucion);

module.exports = router;