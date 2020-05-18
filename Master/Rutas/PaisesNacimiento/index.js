'use strict'

const express = require('express');
const PaisesNacimientoController = require('./../../Controladores/PaisesNacimiento');
const auth0 = require('../../Middleware/auth0');
const userProfile = require('./../../Middleware/getUserProfile');
const router = express.Router();

router.get('/paises-nacimiento/listar', [auth0], PaisesNacimientoController.getPaisesNacimiento);

module.exports = router;