'use strict'

const express = require('express');
const ActividadesEconomicasController = require('./../../Controladores/ActividadesEconomicas');
const auth0 = require('../../Middleware/auth0');
const userProfile = require('./../../Middleware/getUserProfile');

const router = express.Router();

router.get('/actividades-economicas/listar', [auth0], ActividadesEconomicasController.getActividadesEconomicas);

module.exports = router;