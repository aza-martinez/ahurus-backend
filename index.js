"use strict";

var mongoose = require("mongoose");
var app = require("./app");
//var port = process.env.PORT || 3002;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;


