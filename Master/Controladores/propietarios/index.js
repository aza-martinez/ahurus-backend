'use strict';

const https = require('https');
var request = require('request');
const PropietarioModel = require('../../Modelos/propietarios/propietarios');
var Institucion = require('../../Modelos/instituciones/instituciones');
var Usuario = require('../../Modelos/usuarios/usuarios');
const fs = require('fs');
const Cuenta = require('../../Modelos/cuentas/cuentas');
const Pais = require('./../../Modelos/PaisesNacimiento');
const Estados = require('../../Modelos/EntidadesFederativas/EntidadesFederativas');
var Tipo = require('../../Modelos/tipos_cuentas/tipos_cuentas');
var azure = require('azure-storage');
var XLSX = require('xlsx');
const moment = require('moment');
const bcryptjs = require('bcryptjs');
const Counter = require('../../Modelos/counters/counters');
var crypto = require('crypto');
const axios = require('axios');
const URL_STP_REGISTRO_CUENTA = 'https://demo.stpmex.com:7024/speidemows/rest/cuentaModule/fisica';
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';

if (node_env == 'production') {
	var certificado = envJSON[node_env].CERTS_URL_P;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_P;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_P;
	var key = envJSON[node_env].AZURE_KEY_STORAGE_P;
	var account = envJSON[node_env].AZURE_SACCOUNT_P;
	var container = envJSON[node_env].AZURE_SCONTAINER_ACCOUNTS_P;
	var containerUser = envJSON[node_env].AZURE_SCONTAINER_USERS_P;
	var data = envJSON[node_env].METADATA_P;
} else {
	var certificado = envJSON[node_env].CERTS_URL_D;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_D;
	var key = envJSON[node_env].AZURE_KEY_STORAGE_D;
	var account = envJSON[node_env].AZURE_SACCOUNT_D;
	var container = envJSON[node_env].AZURE_SCONTAINER_ACCOUNTS_D;
	var containerUser = envJSON[node_env].AZURE_SCONTAINER_USERS_D;
	var data = envJSON[node_env].METADATA_D;
}
const KEY_STORAGE = key;
const STORAGE_ACCOUNT = account;
const STORAGE_CONTAINER = container;
const STORAGE_CONTAINER_U = containerUser;
const MongooseConnect = require('./../../MongooseConnect');
const { nextTick } = require('process');

class PropietarioController {
	constructor() {
		this.model = PropietarioModel;
	}

	async crearPropietario(req, res) {
		try {
			const params = req.body;

			const SERVER_BD = req.user[`${data}`].empresa;
			const mongo = new MongooseConnect();
			await mongo.connect(SERVER_BD);

			// OBTENEMOS FECHA
			var fecha = new Date();
			var fechaMX = moment(fecha).tz('America/Mexico_City');

			// CREAMOS INSTANCIA DE PROPIETARIO Y SETEAMOS VALORES
			const propietario = new this.model();
			propietario.id_terceros = params.id_terceros;
			propietario.rfc = params.rfc;
			propietario.razon_social = params.razon_social;
			propietario.correo1 = params.correo1;
			propietario.correo2 = params.correo2;
			propietario.genero = params.genero;
			propietario.paisNacimiento = params.paisNacimiento;
			propietario.nombre = params.nombre;
			propietario.entidadFederativa = params.entidadFederativa;
			propietario.municipio = params.municipio;
			propietario.colonia = params.colonia;
			propietario.calle = params.calle;
			propietario.numExterior = params.numExterior;
			propietario.numInterior = params.numInterior;
			propietario.codigoPostal = params.codigoPostal;
			propietario.nombre_contacto = params.nombre_contacto;
			propietario.telefono = params.telefono;
			propietario.estatus = true;
			propietario.empresa = params.empresa;
			propietario.timestamp = fechaMX._d;
			propietario.tipo_propietario = params.tipo_propietario;

			await this.model.exists(
				{
					rfc: params.rfc,
				},
				async (err, existePropietario) => {
					if (err) return res.status(500).send({});

					if (existePropietario) return res.status(400).send('Propietario ya existente');

					await propietario.save(async (err, propietarioStored) => {
						const close = await mongo.close();
						if (err || !propietarioStored) return res.status(400).send('No se pudo guardar el propietario');

						return res.status(200).send({
							...propietarioStored._doc,
						});
					});
				}
			);
		} catch (error) {
			const close = await mongo.close();
			return res.send(500).send('No se pudo completar la operación');
		}
	}

	async registrarPropietarioSTP(propietario, cuenta) {
		const firma = await this.generarFirma(propietario, cuenta);

		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		const query = {
			...propietario,
			firma,
			cuenta: cuenta.clabe,
		};

		const response = await axios
			.put(URL_STP_REGISTRO_CUENTA, query, {
				httpsAgent: agent,
			})
			.then(({ data }) => {})
			.catch(e => {});
		return response;
	}

	async generarFirma(propietario, cuenta) {
		let cadenaOriginal = `||${propietario.empresa}`;
		cadenaOriginal += `|${cuenta.clabe}|`;
		cadenaOriginal += `${propietario.rfcCurp}||`;

		const private_key = await fs.readFileSync('certs/RPF/prueba-key.pem', 'utf-8');
		const signer = await crypto.createSign('sha256');
		await signer.update(cadenaOriginal);
		await signer.end();

		const signature = await signer.sign(
			{
				key: private_key,
				passphrase: '12345678',
			},
			'base64'
		);

		return signature;
	}

	async update(req, res) {
		const propietarioId = req.params.id;
		const params = req.body;

		try {
			!validator.isEmpty(params.estatus);
		} catch (err) {
			return res.status(200).send({});
		}

		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		this.model.findOneAndUpdate(
			{
				_id: propietarioId,
			},
			params,
			{
				new: true,
			},
			async (err, propietarioUpdated) => {
				const close = await mongo.close();

				if (err) return res.status(500).send({});

				return res.status(200).send({
					propietarioUpdated,
				});
			}
		);
	}

	async getPropietariosPFA(req, res) {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const query = this.model
			.find({
				tipo_propietario: 'personaFisica',
				estatus: true,
			})
			.populate('paisNacimiento')
			.populate('entidadFederativa')
			.populate('actividadEconomica');

		query.sort('-_id').exec(async (err, propietarios) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!propietarios) return res.status(404).send({});

			return res.status(200).send(propietarios);
		});
	}

	async getPropietario(req, res) {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const propietarioId = req.params.id;

		this.model.findById(propietarioId, async (err, propietario) => {
			const close = await mongo.close();

			if (err || !propietarioId) return res.status(404).send({});

			return res.status(200).send({
				...propietario._doc,
			});
		});
	}

	async getPropietarios(req, res) {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const query = this.model.find({
			estatus: true,
		});

		const propietarios = query.sort('_id').exec(async (err, propietarios) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!propietarios) return res.status(404).send({});

			return res.status(200).send(propietarios);
		});
	}

	async getPropietariosPMI(req, res) {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const query = this.model.find({
			tipo_propietario: 'personaMoral',
			estatus: false,
		});

		query.sort('-_id').exec(async (err, propietarios) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!propietarios) return res.status(404).send({});

			return res.status(200).send([...propietarios]);
		});
	}
	async getPropietariosPMA(req, res) {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const query = this.model.find({
			tipo_propietario: 'personaMoral',
			estatus: true,
		});

		query.sort('-_id').exec(async (err, propietarios) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!propietarios) return res.status(404).send({});

			return res.status(200).send(propietarios);
		});
	}

	async getPropietariosPFI(req, res) {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const query = this.model.find({
			tipo_propietario: 'personaFisica',
			estatus: false,
		});

		query.sort('-_id').exec(async (err, propietarios) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!propietarios) return res.status(404).send({});

			return res.status(200).send(propietarios);
		});
	}
	async importAccounts(req, res) {
		let id_terceros = req.body.propietario;
		var file_name = 'Documento no subido..';
		const user = req.user[`${data}`].user;
		var params = req.body;
		if (!req.files) {
			return res.status(404).send({});
		}
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		const folio = await Counter.findByIdAndUpdate(
			{
				_id: 'cuentas',
			},
			{
				$inc: {
					invoice: 1,
				},
			}
		);

		console.log('ULTIMO FOLIO DISPERSION: ' + folio.invoice);
		var file_path = req.files.file.path;
		var file_name = folio.invoice + '_' + req.files.file.originalFilename;
		var extension_split = file_name.split('.');
		var file_ext = extension_split[1];
		let registro = {};
		const blobService = azure.createBlobService(STORAGE_ACCOUNT, KEY_STORAGE);
		let fileStorage = null;
		const startDate = new Date();
		const expiryDate = new Date(startDate);

		const sharedAccessPolicy = {
			AccessPolicy: {
				Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
				start: startDate,
				Expiry: azure.date.minutesFromNow(20),
			},
		};
		await blobService.createBlockBlobFromLocalFile(STORAGE_CONTAINER, file_name, file_path, async (e, result, req) => {
			if (e) {
				return;
			}

			const token = await blobService.generateSharedAccessSignature(STORAGE_CONTAINER, result.name, sharedAccessPolicy);
			const fileURLStorage = await blobService.getUrl(STORAGE_CONTAINER, result.name, token, true);

			await request(
				fileURLStorage,
				{
					encoding: null,
				},
				async (error, response, body) => {
					var workbook = XLSX.read(body, {
						type: 'buffer',
					});
					const referencia = workbook.Sheets['Cuentas']['!ref'];
					const primeraFila = referencia.split(':')[0].substr(1);
					const ultimaFila = referencia.split(':')[1].substr(1);

					delete workbook.Sheets['Cuentas']['!ref'];
					delete workbook.Sheets['Cuentas']['!margins'];
					const FILAS = workbook.Sheets['Cuentas'];

					// const jsonToArrayvar
					let jsonToArray = [];

					var fecha = new Date();
					var fechaOperacion = moment(fechaMX).format('YYYYMMDD');
					var fechaMX = moment(fecha).tz('America/Mexico_City');
					//Obtenemos la data del excel.
					var sheetIndex = 1;
					var workbook = XLSX.readFile(file_path);
					var sheet_name_list = workbook.SheetNames;
					const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[sheetIndex - 1]]);
					//Agregamos la data faltante a los objetos.
					//let centro_costo = JSON.parse(params.centroCosto);

					// INICIO FOREACH

					let descripcion = '';
					let clabe = '';
					let tipoC = '';
					let institucion = '';
					let propietario = '';
					let tipoReg = '';
					for await (let dato of data) {
						/* 		const queryTipoCuenta = await Tipo.findById({});
						console.log(queryTipoCuenta); */
						const tipoCuenta = new Cuenta();

						//Creamos el objeto transferencia cada que recorremos el ciclo y le pasamos los datos

						descripcion = dato.descripcion;
						clabe = dato.clabe;
						tipoC = dato.tipo_cuenta;
						institucion = dato.institucion;
						propietario = dato.propietario;
						tipoReg = dato.tipo_registro;
						var queryTipoCuenta = await Tipo.find({ clave: tipoC }).exec();
						var queryInstitucion = await Institucion.find({ clabe: institucion }).exec();
						var queryPropietario = await PropietarioModel.find({ id_terceros: id_terceros }).exec();
						tipoCuenta.descripcion = descripcion;
						tipoCuenta.clabe = clabe;
						tipoCuenta.tipo_cuenta = queryTipoCuenta[0]._id;
						tipoCuenta.institucion = queryInstitucion[0]._id;
						tipoCuenta.propietario = queryPropietario[0]._id;
						tipoCuenta.tipo_registro = tipoReg;
						tipoCuenta.estatus = true;
						tipoCuenta.timestamp = fechaMX._d;
						const newAccount = await tipoCuenta.save();
						console.log(newAccount);
					} //FIN  DEL FOREACH
					const close = await mongo.close();
					return res.status(200).send();
				}
			);
			return;
		});
	}
	async importOwners(req, res) {
		var file_name = 'Documento no subido..';
		const user = req.user[`${data}`].user;
		console.log(user);
		var params = req.body;
		if (!req.files) {
			return res.status(404).send({});
		}
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		const folio = await Counter.findByIdAndUpdate(
			{
				_id: 'propietarios',
			},
			{
				$inc: {
					invoice: 1,
				},
			}
		);

		console.log('ULTIMO FOLIO PROPIETARIOS: ' + folio.invoice);
		var file_path = req.files.file.path;
		var file_name = folio.invoice + '_' + req.files.file.originalFilename;
		var extension_split = file_name.split('.');
		var file_ext = extension_split[1];
		let registro = {};
		const blobService = azure.createBlobService(STORAGE_ACCOUNT, KEY_STORAGE);
		let fileStorage = null;
		const startDate = new Date();
		const expiryDate = new Date(startDate);

		const sharedAccessPolicy = {
			AccessPolicy: {
				Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
				start: startDate,
				Expiry: azure.date.minutesFromNow(20),
			},
		};
		await blobService.createBlockBlobFromLocalFile(STORAGE_CONTAINER, file_name, file_path, async (e, result, req) => {
			if (e) {
				return;
			}

			const token = await blobService.generateSharedAccessSignature(STORAGE_CONTAINER, result.name, sharedAccessPolicy);
			const fileURLStorage = await blobService.getUrl(STORAGE_CONTAINER, result.name, token, true);

			await request(
				fileURLStorage,
				{
					encoding: null,
				},
				async (error, response, body) => {
					var workbook = XLSX.read(body, {
						type: 'buffer',
					});
					const referencia = workbook.Sheets['Propietarios']['!ref'];
					const primeraFila = referencia.split(':')[0].substr(1);
					const ultimaFila = referencia.split(':')[1].substr(1);

					delete workbook.Sheets['Propietarios']['!ref'];
					delete workbook.Sheets['Propietarios']['!margins'];
					const FILAS = workbook.Sheets['Propietarios'];

					// const jsonToArrayvar
					let jsonToArray = [];

					var fecha = new Date();
					var fechaOperacion = moment(fechaMX).format('YYYYMMDD');
					var fechaMX = moment(fecha).tz('America/Mexico_City');
					//Obtenemos la data del excel.
					var sheetIndex = 1;
					var workbook = XLSX.readFile(file_path);
					var sheet_name_list = workbook.SheetNames;
					const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[sheetIndex - 1]]);
					//Agregamos la data faltante a los objetos.
					//let centro_costo = JSON.parse(params.centroCosto);

					// INICIO FOREACH

					let nombre = '';
					let alias = '';
					let rfc = '';
					let razon_social = '';
					let correo1 = '';
					let correo2 = '';
					let telefono = '';
					let tipo_propietario = '';
					let genero = ''; //OPCIONAL
					let pais = ''; //OPCIONAL
					let entidad = ''; //OPCIONAL
					let municipio = ''; // OPCIONAL
					let colonia = ''; // OPCIONAL
					let calle = ''; // OPCIONAL
					let numInt = ''; //OPCIONAL
					let numExt = ''; //OPCIONAL
					let cp = ''; //OPCIONAL

					for await (let dato of data) {
						const owner = new PropietarioModel();
						//Creamos el objeto transferencia cada que recorremos el ciclo y le pasamos los datos
						nombre = dato.nombre;
						alias = dato.alias;
						rfc = dato.rfc;
						correo1 = dato.correo1;
						correo2 = dato.correo2;
						telefono = dato.telefono;
						razon_social = dato.razon_social;
						genero = dato.genero;
						pais = dato.pais;
						tipo_propietario = dato.tipo_propietario;
						municipio = dato.municipio;
						colonia = dato.colonia;
						calle = dato.calle;
						numInt = dato.numInt;
						numExt = dato.numExt;
						cp = dato.cp;

						owner.nombre = nombre;
						owner.id_terceros = alias;
						owner.rfc = rfc;
						owner.razon_social = razon_social;
						owner.correo1 = correo1;
						owner.correo2 = correo2;
						owner.telefono = telefono;
						owner.tipo_propietario = tipo_propietario;
						owner.municipio = municipio;
						owner.colonia = colonia;
						owner.calle = calle;
						owner.numInt = numInt;
						owner.numExt = numExt;
						owner.cp = cp;
						owner.estatus = true;
						owner.timestamp = fechaMX._d;
						const newOwner = await owner.save();
						console.log(newOwner);
					} //FIN  DEL FOREACH
					const close = await mongo.close();
					return res.status(200).send();
				}
			);
			return;
		});
	}
	async importUsers(req, res) {
		var file_name = 'Documento no subido..';
		const user = 'arendon'; //loginEmpresa.user;
		var params = req.body;
		if (!req.files) {
			return res.status(404).send({});
		}
		const SERVER_BD = 'master'; //loginEmpresa
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		const folio = await Counter.findByIdAndUpdate(
			{
				_id: 'users',
			},
			{
				$inc: {
					invoice: 1,
				},
			}
		);

		console.log('ULTIMO FOLIO USER: ' + folio.invoice);
		var file_path = req.files.file.path;
		var file_name = folio.invoice + '_' + req.files.file.originalFilename;
		var extension_split = file_name.split('.');
		var file_ext = extension_split[1];
		let registro = {};
		const blobService = azure.createBlobService(STORAGE_ACCOUNT, KEY_STORAGE);
		let fileStorage = null;
		const startDate = new Date();
		const expiryDate = new Date(startDate);

		const sharedAccessPolicy = {
			AccessPolicy: {
				Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
				start: startDate,
				Expiry: azure.date.minutesFromNow(20),
			},
		};
		await blobService.createBlockBlobFromLocalFile(STORAGE_CONTAINER_U, file_name, file_path, async (e, result, req) => {
			if (e) {
				return;
			}

			const token = await blobService.generateSharedAccessSignature(STORAGE_CONTAINER_U, result.name, sharedAccessPolicy);
			const fileURLStorage = await blobService.getUrl(STORAGE_CONTAINER_U, result.name, token, true);

			await request(
				fileURLStorage,
				{
					encoding: null,
				},
				async (error, response, body) => {
					var workbook = XLSX.read(body, {
						type: 'buffer',
					});
					const referencia = workbook.Sheets['Usuarios']['!ref'];
					const primeraFila = referencia.split(':')[0].substr(1);
					const ultimaFila = referencia.split(':')[1].substr(1);

					delete workbook.Sheets['Usuarios']['!ref'];
					delete workbook.Sheets['Usuarios']['!margins'];
					const FILAS = workbook.Sheets['Usuarios'];

					// const jsonToArrayvar
					let jsonToArray = [];
					var fecha = new Date();
					var fechaOperacion = moment(fechaMX).format('YYYYMMDD');
					var fechaMX = moment(fecha).tz('America/Mexico_City');
					//Obtenemos la data del excel.
					var sheetIndex = 1;
					var workbook = XLSX.readFile(file_path);
					var sheet_name_list = workbook.SheetNames;
					const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[sheetIndex - 1]]);

					// INICIO FOREACH

					let nombre = '';
					let perfil = '';
					let correo = '';
					let telefono = '';
					let empresa = '';
					let usuario = '';
					let password = '';
					for await (let dato of data) {
						const user = new Usuario();
						nombre = dato.nombre;
						perfil = dato.perfil;
						correo = dato.correo;
						telefono = dato.telefono;
						empresa = dato.empresa;
						usuario = dato.usuario;
						password = dato.password;
						console.log(password);
						user.nombre = nombre;
						user.perfil = perfil;
						user.correo = correo;
						user.telefono = telefono;
						user.empresa = empresa;
						user.usuario = usuario;
						const hash = bcryptjs.hashSync(password, 11);
						user.password = hash;
						user.estatus = true;
						user.timestamp = fechaMX._d;
						if (perfil === 'Administrador') {
							const userAdmin = await Counter.findByIdAndUpdate(
								{
									_id: 'user_admin',
								},
								{
									$inc: {
										invoice: 1,
									},
								}
							);
						} else {
							const userUser = await Counter.findByIdAndUpdate(
								{
									_id: 'user_user',
								},
								{
									$inc: {
										invoice: 1,
									},
								}
							);
						}
						const newUser = await user.save();
						console.log(newUser);
					} //FIN  DEL FOREACH
					const close = await mongo.close();
					return res.status(200).send();
				}
			);
			return;
		});
	}
}

module.exports = new PropietarioController();
