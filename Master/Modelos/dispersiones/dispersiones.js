
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DispersionesSchema = Schema({
    archivo: String,
    claveRastreo: String,
    conceptoPago: String, // FRONT  
    cuentaBeneficiario: String, // FRONT
    cuentaOrdenante: String,
    emailBeneficiario: String,
    empresa: String,
    fechaOperacion: String,
    firma: String,
    folioOrigen: String,
    institucionContraparte: String,
    institucionOperante: String,
    monto: String,// {type: mongoose.Schema.Types.Decimal},
    nombreBeneficiario: String,
    nombreOrdenante: String,
    referenciaNumerica: String,
    rfcCurpBeneficiario: String,
    rfcCurpOrdenante: String,
    tipoCuentaBeneficiario: String,
    tipoCuentaOrdenante: String,
    tipoPago: String,
    estatus: Boolean,
    topologia: String,
    medioEntrega: String,
    timestamp: Date,
    iva: String, //{type: mongoose.Schema.Types.Decimal},
    estatus_stp: String,
    institucion: { type: Schema.ObjectId, ref: "Instituciones" },
    idDispersion: { type: Schema.ObjectId, ref: "Dispersiones" },
    idTransferencia: [{ type: Schema.ObjectId, ref: "Transferencias" }],
    Id: String,
    descripcionError: String,
    resultado: String,
    idDispersion: String,
    usuario: String,
    ruta: String,
    fechaSubida: String,
    medio:String,
}, { versionKey: false });

module.exports = mongoose.model('Dispersiones', DispersionesSchema);