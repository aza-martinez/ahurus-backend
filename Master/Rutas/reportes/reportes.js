'use strict';

var express = require('express');
var reportController = require('../../Controladores/reportes/reportes');
var auth0 = require('../../Middleware/auth0');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();
const userProfile = require('./../../Middleware/getUserProfile');

// Rutas útiles
router.post('/report/t/pendientes/:id?', [], reportController.ftPendientes);
router.post('/report/t/ejecutadas/:id?', [], reportController.ftEjecutadas);
router.post('/report/t/exitosas/:id?', [], reportController.ftExitosas);
router.post('/report/t/rechazadas/:id?', [], reportController.ftDevolucion);
router.post('/report/t/track/:id?', [], reportController.getTrack);
router.post('/report/balance/:id?', [], reportController.getBalance);

router.post('/report/d/pendientes/:id?', [], reportController.fdPendientes);
router.post('/report/d/ejecutadas/:id?', [], reportController.fdEjecutadas);
router.post('/report/d/exitosas/:id?', [], reportController.fdExitosas);
router.post('/report/d/rechazadas/:id?', [], reportController.fdDevolucion);

module.exports = router;
