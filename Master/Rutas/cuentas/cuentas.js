'use strict'
const express = require('express');
const CuentasController = require('../../Controladores/cuentas/cuentas');
const validarPropietario = require('./../../Controladores/cuentas/validarPropietarioExistente');
const auth0 = require('../../Middleware/auth0');
const validateCuenta = require('./../../Middleware/validate/validateCuenta');
const userProfile = require('./../../Middleware/getUserProfile');

const router = express.Router();
router.get('/cuentas/clientes/listarA', CuentasController.getCuentasCA);
router.get('/cuentas/proveedores/listarA/:last?', CuentasController.getCuentasPA);
router.get('/cuentas/propietarios/listarA/:last?', CuentasController.getPropietariosA);
router.get('/cuentas/propietarios/buscar/:search', [auth0, userProfile], CuentasController.getPropietario);
router.get('/cuentas/propietarios/listar/:search', [auth0, userProfile], CuentasController.getCuentasPropietarios);
router.get('/cuentas/listarCuentas/:last?', [auth0, userProfile], CuentasController.getCuentas);
router.post('/cuentas/guardar', [auth0, userProfile, validateCuenta], CuentasController.save);
router.put('/cuenta/desactivar/:id', [auth0, userProfile], CuentasController.hide);
router.put('/cuenta/modificar/:id', [auth0, userProfile], CuentasController.update);
router.delete('/cuenta/elimiar/:id', [auth0, userProfile], CuentasController.delete);

module.exports = router;