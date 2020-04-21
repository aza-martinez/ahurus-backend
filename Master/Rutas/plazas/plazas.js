'use strict'

var express = require('express');
var PlazasController = require('../../Controladores/plazas/plazas');
var auth0 = require('../../Middleware/auth0');
const userProfile = require('./../../Middleware/getUserProfile');
var router = express.Router();

// Rutas útiles
router.post('/plaza/guardar', [auth0], PlazasController.save);
router.get('/plazas/listar/:last?', [auth0], PlazasController.getPlazas);
router.get('/plaza/buscar/:id', [auth0], PlazasController.getPlaza);
router.get('/plazas/filtrar/:search', [auth0], PlazasController.search);

module.exports = router;