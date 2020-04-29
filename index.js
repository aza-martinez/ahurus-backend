"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3002;
//var envJSON = require('./env.variables.json');
var url_certificado = process.env.URL_CERT_PRODUCCION || "certs/desarrollo/llavePrivada.pem";
var passphrase_certificado = process.env.PASSPHRASE_CERT_PRODUCCION || "mWEYKJ4Zdi";

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost: ' + port);
    console.log('URL CERTIFICADO: ' + url_certificado);
    console.log('PASSPHRASE: ' + passphrase_certificado);
});