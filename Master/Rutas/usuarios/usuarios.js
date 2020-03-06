'use strict'
var express = require('express');
var UsuariosController = require('../../Controladores/usuarios/usuarios');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/usuario/guardar', [auth0, userProfile], UsuariosController.save);
router.get('/usuarios/listarA/:last?', [auth0, userProfile],  UsuariosController.getUsuariosA);
router.get('/usuarios/listarI/:last?',  [auth0, userProfile], UsuariosController.getUsuariosI);
router.get('/usuario/buscar/:id',  [auth0, userProfile], UsuariosController.getUsuario);
router.get('/usuarios/filtrar/:search',  [auth0, userProfile], UsuariosController.search);
router.put('/usuarios/desactivar/:id',  [auth0, userProfile], UsuariosController.hide);
module.exports = router;