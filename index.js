"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var envJSON = require('./env.variables.json');
var node_env = process.env.NODE_ENV || 'development';


if (node_env == "production") {
    var puerto = envJSON[node_env].PORT_P;
} else {
    var puerto = envJSON[node_env].PORT_D;
}

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
app.listen(puerto, () => {
    console.log('Servidor corriendo en http://localhost: ' + puerto);
    console.log('ENTORNO: ' + node_env);
});