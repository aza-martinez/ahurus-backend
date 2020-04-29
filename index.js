"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3002;
const url_certificado = process.env.URL_CERT_PRODUCCION || "certs/desarrollo/llavePrivada.pem";
const passphrase_certificado = process.env.PASSPHRASE_CERT_PRODUCCION || "mWEYKJ4Zdi";

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:' + port);
    console.log(url_certificado);
    console.log(passphrase_certificado);
});