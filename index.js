"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var envJSON = require('./env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
var puerto = process.env.PORT || 3002;;

//NODE_ENV=production npm start
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
/* app.listen(puerto, () => {
    console.log('Servidor corriendo en http://localhost: ' + puerto);
    console.log('ENTORNO: ' + node_env);
}); */