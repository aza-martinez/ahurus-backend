'use strict'
var express = require('express');
var UsuariosController = require('../../Controladores/usuarios/usuarios');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/usuario/guardar', [auth0], UsuariosController.save);
router.get('/usuarios/listarA/:last?', [auth0], UsuariosController.getUsuariosA);
router.get('/usuarios/listarI/:last?', [auth0], UsuariosController.getUsuariosI);
router.get('/usuario/buscar/:id', [auth0], UsuariosController.getUsuario);
router.get('/usuarios/filtrar/:search', [auth0], UsuariosController.search);
router.put('/usuarios/desactivar/:id', [auth0], UsuariosController.hide);
module.exports = router;