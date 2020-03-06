'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ErroresSchema = Schema({
    clave: Number,
    descripcion: String,
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('Errores', ErroresSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colección