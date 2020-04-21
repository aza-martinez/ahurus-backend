'use strict'

var express = require('express');
var reportController = require('../../Controladores/reportes/reportes');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/reportes/transferencias/pendientes/:id?', [auth0], reportController.ftPendientes);
router.post('/reportes/transferencias/ejecutadas/:id?', [auth0], reportController.ftEjecutadas);
router.post('/reportes/transfeurrencias/exitosas/:id?', [auth0], reportController.ftExitosas);
router.post('/reportes/transferencias/rechazadas/:id?', [auth0], reportController.ftDevolucion);
router.post('/reportes/transferencias/canceladas/:id?', [auth0], reportController.ftCancelada);

router.post('/reportes/dispersiones/pendientes/:id?', [auth0], reportController.fdPendientes);
router.post('/reportes/dispersiones/ejecutadas/:id?', [auth0], reportController.fdEjecutadas);
router.post('/reportes/dispersiones/exitosas/:id?', [auth0], reportController.fdExitosas);
router.post('/reportes/dispersiones/rechazadas/:id?', [auth0], reportController.fdDevolucion);
router.post('/reportes/dispersiones/canceladas/:id?', [auth0], reportController.fdCancelada);

module.exports = router;