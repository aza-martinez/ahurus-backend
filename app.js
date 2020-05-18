'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var envJSON = require("./env.variables.json");
var node_env = process.env.NODE_ENV || "development";
var puerto = process.env.PORT || 3002;


/* https
  .createServer(
    {
      key: fs.readFileSync('./certs/SSL-PRODUCTION/STAR_ahurus_com_key.txt'),
      cert: fs.readFileSync('./certs/SSL-PRODUCTION/star.ahurus.com.crt'),
    },
    app
  )
  .listen(puerto, function() {
    console.log('Servidor Ahurus Corriendo En: ' + puerto);
    console.log('ENTORNO: ' + node_env);
  }); */

const routes = require('./Master/Rutas/rutas');

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, E-CLIENT, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use('/api', [routes]);

module.exports = app;
