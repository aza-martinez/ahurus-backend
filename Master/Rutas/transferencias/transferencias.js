'use strict';
var express = require('express');
var TransferenciasController = require('../../Controladores/transferencias/transferencias');
var auth0 = require('../../Middleware/auth0');

var router = express.Router();
router.get('/transferencias/listar/:search?', auth0, TransferenciasController.getTransferencias);
router.get('/transferencias/listarCanceladas/:search?', auth0, TransferenciasController.getTransferenciasC);
router.get('/transferencias/listarA/:search?', auth0, TransferenciasController.getTransferenciasA);
router.get('/transferencias/buscar/:search', auth0, TransferenciasController.getTransferencia);
router.get('/transferencias/buscarTransferencia/:id', auth0, TransferenciasController.buscarTransferencia);
router.get('/transferencia/ejecutar/:id/', auth0, TransferenciasController.ejecutar);
router.post('/transferencia/guardar/:id?', auth0, TransferenciasController.save);
router.put('/transferencia/cancelar/:id', [auth0], TransferenciasController.hide);
router.put('/transferencia/modificar/:id', [auth0], TransferenciasController.update);
router.get('/transferencias/listarTD/:id', [auth0], TransferenciasController.getTransferenciasDispersion);
router.put('/cambioDeEstado/', TransferenciasController.response);
router.get('/pdf/:id', [auth0], TransferenciasController.generatePDF);
router.get('/pdf/dispersion/:id', [auth0], TransferenciasController.generatePDFDispersion);

module.exports = router;
