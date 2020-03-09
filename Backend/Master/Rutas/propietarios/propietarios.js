'use strict'

const express = require('express');
const PropietariosController = require('../../Controladores/propietarios');
const auth0 = require('../../Middleware/auth0');
const validarPropietario = require('./../../Middleware/validate/validatePropietario');
const router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/propietario/guardar', [auth0, validarPropietario, userProfile], (...args) => PropietariosController.crearPropietario(...args));
router.get('/propietarios/personasFisicas/listarI',[auth0, userProfile], (...args) =>  PropietariosController.getPropietariosPFI(...args));
router.get('/propietarios/personasFisicas/listarA',[auth0, userProfile], (...args) =>  PropietariosController.getPropietariosPFA(...args));
router.get('/propietarios/personasMorales/listarI/:last?',[auth0, userProfile], (...args) =>  PropietariosController.getPropietariosPMI(...args));
router.get('/propietarios/personasMorales/listarA/:last?',[auth0, userProfile], (...args) =>  PropietariosController.getPropietariosPMA(...args));
router.get('/propietarios/listar/:last?', [auth0, userProfile], (...args) =>  PropietariosController.getPropietarios(...args));
router.get('/propietario/buscar/:id',[auth0, userProfile], (...args) =>  PropietariosController.getPropietario(...args));
router.put('/propietario/desactivar/:id', [auth0, userProfile], (...args) => PropietariosController.update(...args));

module.exports = router;