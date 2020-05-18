'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var envJSON = require('./env.variables.json');
var fs = require('fs');
var https = require('https');
var node_env = process.env.NODE_ENV || 'development';
//NODE_ENV=production npm start
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

<<<<<<< HEAD
//HTTPS

if (node_env === "production") {
  const  puerto = envJSON[node_env].PORT_P;
  const key = envJSON[node_env].KEY_SSL_P;
  const cert = envJSON[node_env].CERT_SSL_P;
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
} else {
  const puerto = envJSON[node_env].PORT_D;
  app.listen(puerto, () => {
    console.log("Servidor corriendo en http://localhost: " + puerto);
    console.log("ENTORNO: " + node_env);
  });
}
=======
if (node_env == 'production') {
  var puerto = envJSON[node_env].PORT_P;
  var key = envJSON[node_env].KEY_SSL_P;
  var cert = envJSON[node_env].CERT_SSL_P;
} else {
  var puerto = envJSON[node_env].PORT_D;
}
//HTTPS
/* https
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
  });  */
//HTTP
app.listen(puerto, () => {
  console.log('Servidor corriendo en http://localhost: ' + puerto);
  console.log('ENTORNO: ' + node_env);
});
>>>>>>> 3bcd0f5b46b79bcf5ec90c2f4f0f11b3ab5b4262
