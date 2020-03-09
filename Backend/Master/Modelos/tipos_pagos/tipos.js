'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TiposPagosSchema = Schema({
    clave: Number,
    descripcion: String,
    estatus: Boolean,
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('TiposPagos', TiposPagosSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colección