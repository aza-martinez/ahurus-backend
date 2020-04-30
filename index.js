"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var envJSON = require('./env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
var puerto = process.env.PORT || 8080;


mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
app.listen(puerto, () => {
    console.log('Servidor corriendo en http://localhost: ' + puerto);
    console.log('ENTORNO: ' + node_env);
});