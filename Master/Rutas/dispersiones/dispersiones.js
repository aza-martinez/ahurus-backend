'use strict'

var express = require('express');
var dispersionesController = require('../../Controladores/dispersiones/dispersiones');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/dispersiones/importar/:id?' ,[auth0, userProfile, multipartMiddleware] ,dispersionesController.saveFile);
router.get('/dispersiones/listar/:search?',  [auth0, userProfile], dispersionesController.getDispersiones);
router.get('/dispersiones/listarDispersiones/:search?',[auth0, userProfile],  dispersionesController.getAllDispersion);
router.get('/dispersiones/buscarDispersion/:search',[auth0, userProfile],  dispersionesController.buscarDispersion);
router.get('/dispersion/ejecutar/:id',[auth0, userProfile],  dispersionesController.ejecutar);
router.put('/response/:id',[auth0, userProfile],  dispersionesController.response);
router.put('/dispersiones/cancelar/:id',[auth0, userProfile],  dispersionesController.hide);
router.get('/dispersiones/listarCanceladas/:search?',[auth0, userProfile],  dispersionesController.getTransferenciasC);

module.exports = router;