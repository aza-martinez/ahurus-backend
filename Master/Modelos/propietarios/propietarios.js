'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropietariosSchema = Schema(
	{
		id_terceros: String,
		rfc: String,
		razon_social: String,
		correo1: String,
		genero: String,
		fechaNacimiento: String,
		correo2: String,
		nombre_contacto: String,
		telefono: String,
		tipo_propietario: String,
		estatus: Boolean,
		timestamp: Date,
		paisNacimiento: {
			type: Schema.ObjectId,
			ref: 'paises',
		},
		actividadEconomica: {
			type: Schema.ObjectId,
			ref: 'actividadeseconomicas',
		},
		apellidoPaterno: String,
		apellidoMaterno: String,
		nombre: String,
		nombreCompleto: String,
		entidadFederativa: {
			type: Schema.ObjectId,
			ref: 'entidadesfederativas',
		},
		municipio: String,
		Colonia: String,
		Calle: String,
		numExterior: Number,
		numInterior: Number,
		codigoPostal: Number,
		empresa: {
			type: Schema.ObjectId,
			ref: 'empresas',
		},
		cuentas: [
			{
				type: Schema.ObjectId,
				ref: 'Cuentas',
			},
		],
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('Propietarios', PropietariosSchema);
