'use strict'

var express = require('express');
var InstitucionesController = require('../../Controladores/instituciones/instituciones');
var auth0 = require('../../Middleware/auth0');
const userProfile = require('./../../Middleware/getUserProfile');
var router = express.Router();

// Rutas útiles
router.post('/instituciones/guardar', [auth0], InstitucionesController.save);
router.get('/instituciones/listar/:last?', [auth0], InstitucionesController.getInstituciones);
router.get('/instituciones/buscar/:id', [auth0], InstitucionesController.getInstitucion);
router.get('/instituciones/filtrar/:search', [auth0], InstitucionesController.search);

module.exports = router;