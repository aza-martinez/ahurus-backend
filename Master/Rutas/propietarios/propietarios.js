'use strict'

const express = require('express');
const PropietariosController = require('../../Controladores/propietarios');
const auth0 = require('../../Middleware/auth0');
const validarPropietario = require('./../../Middleware/validate/validatePropietario');
const router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/propietario/guardar', [auth0, validarPropietario], (...args) => PropietariosController.crearPropietario(...args));
router.get('/propietarios/personasFisicas/listarI', [auth0], (...args) => PropietariosController.getPropietariosPFI(...args));
router.get('/propietarios/personasFisicas/listarA', [auth0], (...args) => PropietariosController.getPropietariosPFA(...args));
router.get('/propietarios/personasMorales/listarI/:last?', [auth0], (...args) => PropietariosController.getPropietariosPMI(...args));
router.get('/propietarios/personasMorales/listarA/:last?', [auth0], (...args) => PropietariosController.getPropietariosPMA(...args));
router.get('/propietarios/listar/:last?', auth0, (...args) => PropietariosController.getPropietarios(...args));
router.get('/propietario/buscar/:id', [auth0], (...args) => PropietariosController.getPropietario(...args));
router.put('/propietario/desactivar/:id', [auth0], (...args) => PropietariosController.update(...args));

module.exports = router;