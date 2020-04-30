"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var envJSON = require('./env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
var puerto = envJSON[node_env].PORT;
var certificado = envJSON[node_env].CERTS_URL;
var passphrase = envJSON[node_env].PASSPHRASE_CERT;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
app.listen(puerto, () => {
    console.log('Servidor corriendo en http://localhost: ' + puerto);
    console.log('URL CERTIFICADO: ' + certificado);
    console.log('PASSPHRASE: ' + passphrase);
});