'use strict';
const express = require('express');
const CuentasController = require('../../Controladores/cuentas/cuentas');
const PropietariosController = require('../../Controladores/propietarios/index');
const validarPropietario = require('./../../Controladores/cuentas/validarPropietarioExistente');
const auth0 = require('../../Middleware/auth0');
const validateCuenta = require('./../../Middleware/validate/validateCuenta');
const userProfile = require('./../../Middleware/getUserProfile');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const router = express.Router();
router.get('/cuentas/clientes/listarA', auth0, CuentasController.getCuentasCA);
router.get('/cuentas/proveedores/listarA/:last?', auth0, CuentasController.getCuentasPA);
router.get('/cuentas/propietarios/listarA/:last?', auth0, CuentasController.getPropietariosA);
router.get('/cuentas/propietarios/buscar/:search', [auth0], CuentasController.getPropietario);
router.get('/cuentas/propietarios/listar/:search', [auth0], CuentasController.getCuentasPropietarios);
router.get('/cuentas/listarCuentas/:last?', [auth0], CuentasController.getCuentas);
router.post('/cuentas/guardar', [auth0, validateCuenta], CuentasController.save);
router.post('/cuentas/importar', [auth0, multipartMiddleware], PropietariosController.importAccounts);
router.post('/propietarios/importar', [auth0, multipartMiddleware], PropietariosController.importOwners);
router.put('/cuenta/desactivar/:id', [auth0], CuentasController.hide);
router.put('/cuenta/modificar/:id', [auth0], CuentasController.update);
router.delete('/cuenta/elimiar/:id', [auth0], CuentasController.delete);

module.exports = router;
