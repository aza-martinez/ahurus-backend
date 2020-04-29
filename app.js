'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var fs = require('fs');
var https = require('https');
var app = express();
var port = process.env.PORT || 3002;
const url_certificado = process.env.URL_CERT_PRODUCCION || "certs/desarrollo/llavePrivada.pem";
const passphrase_certificado = process.env.PASSPHRASE_CERT_PRODUCCION || "mWEYKJ4Zdi";

/* http.createServer({
  //key: fs.readFileSync('certs/SSL/ahurus.key'),
  //cert: fs.readFileSync('certs/SSL/ahurus.crt')
}, app).listen(port, function () {
  console.log("Servidor Ahurus Corriendo En: " + port);
  console.log(url_certificado);
  console.log(passphrase_certificado);
}); */

const usuario_routes = require('./Master/Rutas/usuarios/usuarios');
const propietarios_routes = require('./Master/Rutas/propietarios/propietarios');
const reportes_routes = require('./Master/Rutas/reportes/reportes');
const plazas_routes = require('./Master/Rutas/plazas/plazas');
const centros_routes = require('./Master/Rutas/centros/centros');
const cuentas_routes = require('./Master/Rutas/cuentas/cuentas');
const devoluciones_routes = require('./Master/Rutas/devoluciones/devoluciones');
const dispersiones_routes = require('./Master/Rutas/dispersiones/dispersiones');
const errores_routes = require('./Master/Rutas/errores/errores');
const instituciones_routes = require('./Master/Rutas/instituciones/instituciones');
const registros_routes = require('./Master/Rutas/transferencias/transferencias');
const estados_routes = require('./Master/Rutas/transferencias/cambiosEstados');
const tipos_cuentas_routes = require('./Master/Rutas/tipos_cuentas/tipos_cuentas');
const tipos_pagos_routes = require('./Master/Rutas/tipos_pagos/tipos');
const entidades_federativas_routes = require('./Master/Rutas/EntidadesFederativas/EntidadesFederativas');
const actividades_economicas_routes = require('./Master/Rutas/ActividadesEconomicas');
const paises_nacimiento_routes = require('./Master/Rutas/PaisesNacimiento');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, E-CLIENT, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/api', [reportes_routes, paises_nacimiento_routes, actividades_economicas_routes, entidades_federativas_routes, dispersiones_routes, estados_routes, centros_routes, devoluciones_routes, errores_routes, instituciones_routes, registros_routes, propietarios_routes, usuario_routes, tipos_cuentas_routes, plazas_routes, cuentas_routes, tipos_pagos_routes]);

module.exports = app;