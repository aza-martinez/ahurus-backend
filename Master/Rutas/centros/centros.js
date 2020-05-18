'use strict'

const express = require('express');
const CentrosController = require('../../Controladores/centros/centros');
const auth0 = require('../../Middleware/auth0');
const router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/centros/guardar', [auth0], CentrosController.save);
router.get('/centros/listarA/:last?', [auth0], CentrosController.getCCA);
router.get('/centros/listarI/:last?', [auth0], CentrosController.getCCI);
router.get('/centros/buscar/:id', [auth0], CentrosController.getCC);
router.put('/centros/desactivar/:id', [auth0], CentrosController.update);

module.exports = router;