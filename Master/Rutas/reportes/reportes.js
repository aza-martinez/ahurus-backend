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
router.post('/report/transfer/', [auth0], reportController.getReportTransfer);
router.post('/report/balance/', [auth0], reportController.getBalance);
router.post('/report/dispersion/', [auth0], reportController.getReportDisper);

module.exports = router;
