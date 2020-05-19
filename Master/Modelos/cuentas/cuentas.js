'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuentasSchema = Schema(
	{
		tipo_cuenta: {
			type: Schema.Types.ObjectId,
			ref: 'TiposCuentas',
			required: true,
		},
		descripcion: {
			type: String,
			required: true,
			trim: true,
		},
		clabe: {
			type: String,
			required: true,
			trim: true,
		},
		tipo_registro: {
			type: String,
			required: true,
			trim: true,
		},
		estatus: {
			type: Boolean,
			default: true,
		},
		propietario: {
			type: Schema.Types.ObjectId,
			ref: 'Propietarios',
			required: true,
		},
		institucion: {
			type: Schema.Types.ObjectId,
			ref: 'Instituciones',
			required: true,
		},
		timestamp: {
			type: Date,
			required: true,
		},
	},
	{ versionKey: false }
);

module.exports = mongoose.model('Cuentas', CuentasSchema);
