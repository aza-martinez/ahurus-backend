'use strict'
var express = require('express');
var TransferenciasController = require('../../Controladores/transferencias/transferencias');
var auth0 = require('../../Middleware/auth0');
const userProfile = require('./../../Middleware/getUserProfile');

var router = express.Router();
router.get('/transferencias/listar/:search?', [auth0, userProfile],  TransferenciasController.getTransferencias);
router.get('/transferencias/listarCanceladas/:search?',  [auth0, userProfile], TransferenciasController.getTransferenciasC);
router.get('/transferencias/listarA/:search?',  [userProfile], TransferenciasController.getTransferenciasA);
router.get('/transferencias/buscar/:search',  [auth0, userProfile], TransferenciasController.getTransferencia);
router.get('/transferencias/buscarTransferencia/:id', [auth0, userProfile],  TransferenciasController.buscarTransferencia);
router.get('/transferencia/ejecutar/:id',  [auth0, userProfile], TransferenciasController.ejecutar);
router.post('/transferencia/guardar/:id?', [auth0, userProfile],  TransferenciasController.save);
router.put('/transferencia/cancelar/:id', [auth0, userProfile],  TransferenciasController.hide);
router.put('/transferencia/modificar/:id', [auth0, userProfile],  TransferenciasController.update);
router.put('/response/:id?', [auth0, userProfile],  TransferenciasController.response);
router.get('/transferencias/listarTD/:id', [auth0, userProfile],  TransferenciasController.getTransferenciasDispersion);
router.put('/cambioDeEstado/', TransferenciasController.response);


module.exports = router;