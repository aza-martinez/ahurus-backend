'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DevolucionesSchema = Schema({
    clave: Number,
    descripcion: String,
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('Devoluciones', DevolucionesSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colección