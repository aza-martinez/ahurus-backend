"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3002;
var env = require('node-env-file');
env(__dirname + '/.env.dist');
var cert_stp = process.env.URL_CERT_PRODUCCION || "certs/desarrollo/llavePrivada.pem";
var passphras_stp = process.env.PASSPHRASE_CERT_PRODUCCION || "mWEYKJ4Zdi";



mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost: ' + port);
    console.log('URL CERTIFICADO: ' + cert_stp);
    console.log('PASSPHRASE: ' + passphras_stp);
});