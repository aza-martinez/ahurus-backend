'use strict'

const express = require('express');
const EntidadesFederativasController = require('../../Controladores/EntidadesFederativas/EntidadesFederativas');
const auth0 = require('../../Middleware/auth0');
const userProfile = require('./../../Middleware/getUserProfile');
const router = express.Router();


router.get('/entidades-federativas/listar', [auth0], EntidadesFederativasController.getEntidadesFederativas);

module.exports = router;