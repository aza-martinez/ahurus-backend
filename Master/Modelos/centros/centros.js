'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CentrosSchema = Schema({

    razon_social: String,
    nombreCentro: String,
    rfcCentro: String,
    domicilioCentro: String,
    numeroCentro: String,
    nombre_contacto: String, 
    correo_contacto: String,
    telefono_contacto: String,
    ctf: String,
    estatus: Boolean,
    cuenta_stp: String,
    tipocuenta: { type: Schema.ObjectId, ref: "TiposCuentas" },
    timestamp: Date,
}, { versionKey: false });

module.exports = mongoose.model('Centros', CentrosSchema);