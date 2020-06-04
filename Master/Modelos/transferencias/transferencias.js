'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransferenciasSchema = Schema(
	{
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
		monto: String, // {type: mongoose.Schema.Types.Decimal},
		nombreBeneficiario: String,
		nombreOrdenante: String,
		referenciaNumerica: String,
		rfcCurpBeneficiario: String,
		rfcCurpOrdenante: String,
		tipoCuentaBeneficiario: String,
		tipoCuentaOrdenante: String,
		tipoPago: String,
		estatus: Boolean,
		entorno: String,
		topologia: String,
		mail: Boolean,
		medioEntrega: String,
		timestamp: Date,
		iva: String, //{type: mongoose.Schema.Types.Decimal},
		estatus_stp: String,
		institucion: { type: Schema.ObjectId, ref: 'Instituciones' },
		idDispersion: { type: Schema.ObjectId, ref: 'Dispersiones' },
		idSTP: String,
		descripcionError: String,
		resultado: String,
		medio: String,
	},
	{ versionKey: false }
);

module.exports = mongoose.model('Transferencias', TransferenciasSchema);
