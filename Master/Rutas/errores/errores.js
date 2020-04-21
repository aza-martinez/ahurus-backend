'use strict'

var express = require('express');
var erroresController = require('../../Controladores/errores/errores');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');
// Rutas útiles
router.post('/errores/guardar', [auth0], erroresController.save);
router.get('/errores/listar/:last?', [auth0], erroresController.getErrores);
router.get('/errores/buscar/:id', [auth0], erroresController.getError);

module.exports = router;