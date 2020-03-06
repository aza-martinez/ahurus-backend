'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadosSchema = Schema({

    cuenta: String,
    razon_social: String,
    idSTP: String,
    institucion: String,
    nombre: String,
    rfc: String,
    domicilio: String,
    numCentro: String,
    correo: String,
    telefono: String,
    cuenta: String,
    clabe: String,
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('Estados', EstadosSchema);