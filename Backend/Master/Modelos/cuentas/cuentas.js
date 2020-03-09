'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuentasSchema = Schema({

    tipo_cuenta: { type: Schema.ObjectId, ref: "TiposCuentas" },
    descripcion: String,
    clabe: String,
    tipo_registro: String,
    estatus: Boolean,
    propietario: { type: Schema.ObjectId, ref: "Propietario" },
    institucion: { type: Schema.ObjectId, ref: "Instituciones" },
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('Cuentas', CuentasSchema);