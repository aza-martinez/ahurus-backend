'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadosSchema = Schema({
    Id: String,
    Empresa: String, // FRONT  
    folioOrigen: String, // FRONT
    Estado: String,
    causaDevolucion: String,
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('Estados', EstadosSchema);