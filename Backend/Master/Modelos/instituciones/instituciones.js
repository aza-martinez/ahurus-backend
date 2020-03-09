'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InstitucionesSchema = Schema({
    clabe: Number,
    participante: String,
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('Instituciones', InstitucionesSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colección