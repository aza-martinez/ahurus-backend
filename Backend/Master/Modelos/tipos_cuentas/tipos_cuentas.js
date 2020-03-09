'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TiposCuentasSchema = Schema({
    clave: Number,
    descripcion: String,
    estatus: Boolean,
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('TiposCuentas', TiposCuentasSchema);