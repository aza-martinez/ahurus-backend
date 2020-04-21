'use strict'

var express = require('express');
var TiposPagosController = require('../../Controladores/tipos_pagos/tipos');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/tipos_pagos/guardar', [auth0], TiposPagosController.save);
router.get('/tipos_pagos/listarA/:last?', auth0, TiposPagosController.getTiposPagosA);
router.get('/tipos_pagos/listarI/:last?', [auth0], TiposPagosController.getTiposPagosI);
router.get('/tipos_pagos/buscar/:id', [auth0], TiposPagosController.getTipoPago);
router.put('/tipos_pagos/desactivar/:id', [auth0], TiposPagosController.update);
module.exports = router;