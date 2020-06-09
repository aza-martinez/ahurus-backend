"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var envJSON = require("./env.variables.json");
var fs = require("fs");
var https = require("https");
var node_env = process.env.NODE_ENV || "development";
var puerto = process.env.PORT || envJSON[node_env].PORT_P;
var puertoDev = process.env.PORT || envJSON[node_env].PORT_D;
//NODE_ENV=development npm start
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

//HTTPS

if (node_env === "production") {
  /* 	app.listen(puerto, () => {
		console.log('Servidor corriendo en http://localhost: ' + puerto);
		console.log('ENTORNO: ' + node_env);
	}); */
  const key = envJSON[node_env].KEY_SSL_P;
  const cert = envJSON[node_env].CERT_SSL_P;
  app.setMaxListeners(0);
  https
    .createServer(
      {
        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert),
      },
    
      app
    )
    .listen(puerto, function () {
      console.log("Servidor Ahurus Corriendo En: " + puerto);
      console.log("ENTORNO: " + node_env);
    });
  app.listen(80, () => {
    console.log("Servidor corriendo en http://localhost: " + 80);
    console.log("ENTORNO: " + node_env);
  });
} else {
  app.setMaxListeners(0)
  app.listen(puertoDev, () => {
    console.log("Servidor corriendo en http://localhost: " + puertoDev);
    console.log("ENTORNO: " + node_env);
  });
}
