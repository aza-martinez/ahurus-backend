'use strict';

const https = require('https');
var request = require('request');
const PropietarioModel = require('../../Modelos/propietarios/propietarios');
var Institucion = require('../../Modelos/instituciones/instituciones');
const fs = require('fs');
const Cuenta = require('../../Modelos/cuentas/cuentas');
var Tipo = require('../../Modelos/tipos_cuentas/tipos_cuentas');
var azure = require('azure-storage');
var XLSX = require('xlsx');
const moment = require('moment');
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
} else {
	var certificado = envJSON[node_env].CERTS_URL_D;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_D;
	var key = envJSON[node_env].AZURE_KEY_STORAGE_D;
	var account = envJSON[node_env].AZURE_SACCOUNT_D;
	var container = envJSON[node_env].AZURE_SCONTAINER_ACCOUNTS_D;
}
const KEY_STORAGE = key;
const STORAGE_ACCOUNT = account;
const STORAGE_CONTAINER = container;
const MongooseConnect = require('./../../MongooseConnect');
const { nextTick } = require('process');

class PropietarioController {
	constructor() {
		this.model = PropietarioModel;
	}

	async crearPropietario(req, res) {
		try {
			const params = req.body;

			const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
			const mongo = new MongooseConnect();
			await mongo.connect(SERVER_BD);

			// OBTENEMOS FECHA
			var fecha = new Date();
			var fechaMX = moment(fecha).tz('America/Mexico_City');

			// CREAMOS INSTANCIA DE PROPIETARIO Y SETEAMOS VALORES
			const propietario = new this.model();
			propietario.id_terceros = params.id_terceros;
			propietario.rfc = params.rfc;
			propietario.razon_social = params.razon_social || `${params.nombre} ${params.apellidoPaterno} ${params.apellidoMaterno}`;
			propietario.correo1 = params.correo1;
			propietario.correo2 = params.correo2;
			propietario.genero = params.genero;
			propietario.paisNacimiento = params.paisNacimiento;
			propietario.apellidoPaterno = params.apellidoPaterno;
			propietario.apellidoMaterno = params.apellidoMaterno;
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

		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
		var file_name = 'Documento no subido..';
		const user = req.user['http://localhost:3000/user_metadata'].user;
		var params = req.body;
		if (!req.files) {
			return res.status(404).send({});
		}
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
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
						var queryPropietario = await PropietarioModel.find({ id_terceros: propietario }).exec();
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
					return res.status(200).send();
				}
			);
			return;
		});
		//	const close = await mongo.close();
	}
	async importOwners(req, res) {
		var file_name = 'Documento no subido..';
		const user = req.user['http://localhost:3000/user_metadata'].user;
		var params = req.body;
		if (!req.files) {
			return res.status(404).send({});
		}
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		const folio = await Counter.findByIdAndUpdate(
			{
				_id: 'dispersiones',
			},
			{
				$inc: {
					invoice: 1,
				},
			}
		);

		console.log('ULTIMO FOLIO DISPERSION: ' + folio.invoice);
		var file_path = req.files.file_path.path;
		var file_name = folio.invoice + '_' + req.files.file_path.originalFilename;
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
					const referencia = workbook.Sheets['Dispersion']['!ref'];
					const primeraFila = referencia.split(':')[0].substr(1);
					const ultimaFila = referencia.split(':')[1].substr(1);

					delete workbook.Sheets['Dispersion']['!ref'];
					delete workbook.Sheets['Dispersion']['!margins'];
					const FILAS = workbook.Sheets['Dispersion'];

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

					let centro_costo = JSON.parse(params.centroCosto);
					let empresa = centro_costo.nombreCentro;
					let institucionOperante = 90646;
					let conceptoPago2 = '';
					let cuentaBeneficiario2 = '';
					let cuentaOrdenante = centro_costo.cuenta_stp;
					fechaOperacion = fechaOperacion;
					let folioOrigen = '';
					let nombreBeneficiario2 = '';
					let nombreOrdenante = centro_costo.razon_social; //NECESARIO
					let rfcCurpBeneficiario = 'ND'; //NECESARIO
					let rfcCurpBeneficiario2 = '';
					let rfcCurpOrdenante = centro_costo.rfcCentro;
					let tipoCuentaBeneficiario2 = '';
					let tipoCuentaOrdenante = 3;
					let claveUsuario = '';
					let claveUsuario2 = '';
					let clavePago = '';
					let refCobranza = '';
					let tipoOperacion = '';
					let topologia = 'T';
					let usuario = '';
					let medioEntrega = 3;
					let prioridad = '';
					let iva = '0.0';
					let resultado = '';
					let idSTP = '';
					let descripcionError = '';

					//DATOS DE LA DISPERSION

					const dispersion = new Dispersion();
					dispersion.usuario = user;
					dispersion.ruta = fileURLStorage;
					dispersion.fechaSubida = fechaMX._d;
					dispersion.estatus = true;
					dispersion.estatus_stp = 'Pendiente';
					dispersion.fechaOperacion = fechaOperacion;
					dispersion.entorno = node_env;
					dispersion.empresa = 'SEFINCE'; /* req.user['http://localhost:3000/user_metadata'].empresa; */
					// INICIO FOREACH
					for await (let dato of data) {
						const folioTrans = await Counter.findByIdAndUpdate(
							{
								_id: 'transferencias',
							},
							{
								$inc: {
									invoice: 1,
								},
							}
						);
						console.log('ULTIMO FOLIO TRANSFERENCIA: ' + folioTrans.invoice);
						let claveRastreo = empresa + folioTrans.invoice;
						const transferencia = new Transferencia();
						dato.empresa = empresa;
						dato.claveRastreo = claveRastreo;
						dato.institucionOperante = institucionOperante;
						dato.conceptoPago2 = conceptoPago2;
						dato.cuentaBeneficiario2 = cuentaBeneficiario2;
						dato.cuentaOrdenante = cuentaOrdenante;
						dato.fechaOperacion = fechaOperacion;
						dato.folioOrigen = folioOrigen;
						dato.nombreBeneficiario2 = nombreBeneficiario2;
						dato.nombreOrdenante = nombreOrdenante;
						dato.rfcCurpBeneficiario = rfcCurpBeneficiario;
						dato.rfcCurpBeneficiario2 = rfcCurpBeneficiario2;
						dato.rfcCurpOrdenante = rfcCurpOrdenante;
						dato.tipoCuentaBeneficiario2 = tipoCuentaBeneficiario2;
						dato.tipoCuentaOrdenante = tipoCuentaOrdenante;
						dato.claveUsuario = claveUsuario;
						dato.claveUsuario2 = claveUsuario2;
						dato.clavePago = clavePago;
						dato.refCobranza = refCobranza;
						dato.tipoOperacion = tipoOperacion;
						dato.topologia = topologia;
						dato.usuario = usuario;
						dato.medioEntrega = medioEntrega;
						dato.prioridad = prioridad;
						dato.iva = iva;
						dato.resultado = resultado;
						dato.idSTP = idSTP;
						dato.descripcionError = descripcionError;
						//Creamos el objeto transferencia cada que recorremos el ciclo y le pasamos los datos
						transferencia.claveRastreo = dato.claveRastreo;
						transferencia.conceptoPago = dato.conceptoPago;
						transferencia.conceptoPago2 = dato.conceptoPago2;
						transferencia.cuentaBeneficiario = dato.cuentaBeneficiario;
						transferencia.cuentaBeneficiario2 = dato.cuentaBeneficiario2;
						transferencia.cuentaOrdenante = dato.cuentaOrdenante;
						transferencia.emailBeneficiario = dato.emailBeneficiario;
						transferencia.empresa = dato.empresa;
						transferencia.fechaOperacion = dato.fechaOperacion;
						transferencia.folioOrigen = dato.folioOrigen;
						transferencia.institucionContraparte = dato.institucionContraparte;
						transferencia.institucionOperante = dato.institucionOperante;
						transferencia.monto = dato.monto;
						transferencia.nombreBeneficiario = dato.nombreBeneficiario;
						transferencia.nombreBeneficiario2 = dato.nombreBeneficiario2;
						transferencia.nombreOrdenante = dato.nombreOrdenante;
						transferencia.rfcCurpBeneficiario = dato.rfcCurpBeneficiario;
						transferencia.rfcCurpBeneficiario2 = dato.rfcCurpBeneficiario2;
						transferencia.rfcCurpOrdenante = dato.rfcCurpOrdenante;
						transferencia.tipoCuentaBeneficiario = dato.tipoCuentaBeneficiario;
						transferencia.tipoCuentaBeneficiario2 = dato.tipoCuentaBeneficiario2;
						transferencia.tipoCuentaOrdenante = dato.tipoCuentaOrdenante;
						transferencia.tipoPago = dato.tipoPago;
						transferencia.estatus = true;
						transferencia.claveUsuario = dato.claveUsuario;
						transferencia.claveUsuario2 = dato.claveUsuario2;
						transferencia.clavePago = dato.clavePago;
						transferencia.refCobranza = dato.refCobranza;
						transferencia.referenciaNumerica = dato.referenciaNumerica;
						transferencia.tipoOperacion = dato.tipoOperacion;
						transferencia.topologia = dato.topologia;
						transferencia.usuario = dato.usuario;
						transferencia.medioEntrega = dato.medioEntrega;
						transferencia.prioridad = dato.prioridad;
						transferencia.iva = dato.iva;
						transferencia.estatus_stp = 'Pendiente';
						transferencia.timestamp = fechaMX._d;
						transferencia.resultado = dato.resultado;
						transferencia.idSTP = dato.idSTP;
						transferencia.descripcionError = dato.descripcionError;
						transferencia.medio = 'Dispersion';
						transferencia.entorno = node_env;

						//Generamos la firma
						var cadenaOriginal = `||${transferencia.institucionContraparte}|`;
						cadenaOriginal += `${transferencia.empresa}|`;
						cadenaOriginal += `${transferencia.fechaOperacion}|`;
						cadenaOriginal += `${transferencia.folioOrigen}|`;
						cadenaOriginal += `${transferencia.claveRastreo}|`;
						cadenaOriginal += `${transferencia.institucionOperante}|`;
						cadenaOriginal += `${transferencia.monto}|`;
						cadenaOriginal += `${transferencia.tipoPago}|`;
						cadenaOriginal += `${transferencia.tipoCuentaOrdenante}|`;
						cadenaOriginal += `${transferencia.nombreOrdenante}|`;
						cadenaOriginal += `${transferencia.cuentaOrdenante}|`;
						cadenaOriginal += `${transferencia.rfcCurpOrdenante}|`;
						cadenaOriginal += `${transferencia.tipoCuentaBeneficiario}|`;
						cadenaOriginal += `${transferencia.nombreBeneficiario}|`;
						cadenaOriginal += `${transferencia.cuentaBeneficiario}|`;
						cadenaOriginal += `${transferencia.rfcCurpBeneficiario}|`;
						cadenaOriginal += `${transferencia.emailBeneficiario}|`;
						cadenaOriginal += `${transferencia.tipoCuentaBeneficiario2}|`;
						cadenaOriginal += `${transferencia.nombreBeneficiario2}|`;
						cadenaOriginal += `${transferencia.cuentaBeneficiario2}|`;
						cadenaOriginal += `${transferencia.rfcCurpBeneficiario2}|`;
						cadenaOriginal += `${transferencia.conceptoPago}|`;
						cadenaOriginal += `${transferencia.conceptoPago2}|`;
						cadenaOriginal += `${transferencia.claveUsuario}|`;
						cadenaOriginal += `${transferencia.claveUsuario2}|`;
						cadenaOriginal += `${transferencia.clavePago}|`;
						cadenaOriginal += `${transferencia.refCobranza}|`;
						cadenaOriginal += `${transferencia.referenciaNumerica}|`;
						cadenaOriginal += `${transferencia.tipoOperacion}|`;
						cadenaOriginal += `${transferencia.topologia}|`;
						cadenaOriginal += `${transferencia.usuario}|`;
						cadenaOriginal += `${transferencia.medioEntrega}|`;
						cadenaOriginal += `${transferencia.prioridad}|`;
						cadenaOriginal += `${transferencia.iva}||`;
						const private_key = fs.readFileSync(certificado, 'utf-8');
						const signer = crypto.createSign('sha256');
						signer.update(cadenaOriginal);
						signer.end();
						const signature = signer.sign(
							{
								key: private_key,
								passphrase: passphrase,
							},
							'base64'
						);
						dato.firma = signature;
						transferencia.idDispersion = dispersion._id;
						transferencia.firma = dato.firma;
						const newTransfer = await transferencia.save();
						dispersion.idTransferencia.push(newTransfer._id);
						console.log(newTransfer);
					} //FIN  DEL FOREACH

					const newDisp = await dispersion.save();
					console.log(newDisp);
					const close = await mongo.close();
					return res.status(200).send(data);
				}
			);
			return;
		});
		//const close = await mongo.close();
	}
}

module.exports = new PropietarioController();
