'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var envJSON = require('./env.variables.json');
var fs = require('fs');
var https = require('https');
var node_env = process.env.NODE_ENV || 'development';

const puertoDev = envJSON[node_env].PORT_D;
const keyDev = envJSON[node_env].KEY_SSL_D;
const certDev = envJSON[node_env].CERT_SSL_D;
const puerto = envJSON[node_env].PORT_P;
const key = envJSON[node_env].KEY_SSL_P;
const cert = envJSON[node_env].CERT_SSL_P;
//NODE_ENV=production npm start
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

//HTTPS

if (node_env === 'production') {
	https
		.createServer(
			{
				key: fs.readFileSync(key),
				cert: fs.readFileSync(cert),
			},
			app
		)
		.listen(puerto, function() {
			console.log('Servidor Ahurus Corriendo En: ' + puerto);
			console.log('ENTORNO: ' + node_env);
		});
} else {
	app.listen(puertoDev, () => {
		console.log('Servidor corriendo en http://localhost: ' + puertoDev);
		console.log('ENTORNO: ' + node_env);
	});
}
