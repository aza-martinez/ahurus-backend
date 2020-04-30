"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var envJSON = require('./env.variables.json');
console.log(envJSON);
var node_env = process.env.NODE_ENV || 'development';
console.log(process.env.NODE_ENV);
console.log(node_env);

if (node_env == "production") {
    var puerto = envJSON[node_env].PORT_P;
    var certificado = envJSON[node_env].CERTS_URL_P;
    var passphrase = envJSON[node_env].PASSPHRASE_CERT_P;
} else {
    var puerto = envJSON[node_env].PORT_D;
    var certificado = envJSON[node_env].CERTS_URL_D;
    var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
}

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
app.listen(puerto, () => {
    console.log('Servidor corriendo en http://localhost: ' + puerto);
    console.log('URL CERTIFICADO: ' + certificado);
    console.log('PASSPHRASE: ' + passphrase);
});