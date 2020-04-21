'use strict'

var express = require('express');
var TiposCuentasController = require('../../Controladores/tipos_cuentas/tipos_cuentas');
var auth0 = require('../../Middleware/auth0');
const userProfile = require('./../../Middleware/getUserProfile');
var router = express.Router();

// Rutas útiles
router.post('/tipo_cuenta/guardar', [auth0], TiposCuentasController.save);
router.get('/tipos_cuentas/listarA/:last?', [auth0], TiposCuentasController.getTiposA);
router.get('/tipos_cuentas/listarI/:last?', [auth0], TiposCuentasController.getTiposI);
router.get('/tipo_cuenta/buscar/:id', [auth0], TiposCuentasController.getTipo);
router.put('/tipo_cuenta/desactivar/:id', [auth0], TiposCuentasController.update);
router.get('/tipos_cuentas/filtrar/:search', [auth0], TiposCuentasController.search);

module.exports = router;