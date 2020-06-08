'use strict';

var fs = require('fs');
const https = require('https');
var request = require('request');
var Dispersion = require('../../Modelos/dispersiones/dispersiones');
var Transferencia = require('../../Modelos/transferencias/transferencias');
var azure = require('azure-storage');
var XLSX = require('xlsx');
const moment = require('moment');
var Counter = require('../../Modelos/counters/counters');
var crypto = require('crypto');
const axios = require('axios');
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (node_env == 'production') {
	var certificado = envJSON[node_env].CERTS_URL_P;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_P;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_P;
	var key = envJSON[node_env].AZURE_KEY_STORAGE_P;
	var account = envJSON[node_env].AZURE_SACCOUNT_P;
	var container = envJSON[node_env].AZURE_SCONTAINER_DISPERSION_P;
	var data = envJSON[node_env].METADATA_P;
} else {
	var certificado = envJSON[node_env].CERTS_URL_D;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_D;
	var key = envJSON[node_env].AZURE_KEY_STORAGE_D;
	var account = envJSON[node_env].AZURE_SACCOUNT_D;
	var container = envJSON[node_env].AZURE_SCONTAINER_DISPERSION_D;
	var data = envJSON[node_env].METADATA_D;
}
const KEY_STORAGE = key;
const STORAGE_ACCOUNT = account;
const STORAGE_CONTAINER = container;
const MongooseConnect = require('./../../MongooseConnect');
const { nextTick } = require('process');

var controller = {
	saveFile: async (req, res) => {
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
				_id: 'dispersiones',
			},
			{
				$inc: {
					invoice: 1,
				},
			}
		);

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
					console.log(req);
					console.log(SERVER_BD);
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
						let claveRastreo = empresa + folioTrans.invoice;
						const transferencia = new Transferencia();
						dato.empresa = empresa;
						dato.claveRastreo = claveRastreo;
						dato.institucionOperante = institucionOperante;
						dato.cuentaOrdenante = cuentaOrdenante;
						dato.fechaOperacion = fechaOperacion;
						dato.nombreOrdenante = nombreOrdenante;
						dato.rfcCurpOrdenante = rfcCurpOrdenante;
						dato.tipoCuentaOrdenante = tipoCuentaOrdenante;
						dato.iva = iva;
						dato.resultado = resultado;
						dato.idSTP = idSTP;
						dato.descripcionError = descripcionError;
						if (dato.emailBeneficiario === 0) {
							dato.emailBeneficiario = '';
						} else {
						}
						//Creamos el objeto transferencia cada que recorremos el ciclo y le pasamos los datos
						transferencia.institucionContraparte = dato.institucionContraparte;
						transferencia.mail = dato.mail;
						transferencia.usuario = user;
						transferencia.empresa = dato.empresa;
						transferencia.fechaOperacion = dato.fechaOperacion;
						const folioOrigen = '';
						transferencia.claveRastreo = dato.claveRastreo;
						transferencia.institucionOperante = 90646;
						transferencia.monto = parseFloat(dato.monto).toFixed(2);
						transferencia.tipoPago = 1;
						transferencia.tipoCuentaOrdenante = dato.tipoCuentaOrdenante;
						transferencia.nombreOrdenante = dato.nombreOrdenante;
						transferencia.cuentaOrdenante = dato.cuentaOrdenante;
						transferencia.rfcCurpOrdenante = dato.rfcCurpOrdenante;
						transferencia.tipoCuentaBeneficiario = dato.tipoCuentaBeneficiario;
						transferencia.nombreBeneficiario = dato.nombreBeneficiario;
						transferencia.cuentaBeneficiario = dato.cuentaBeneficiario;
						transferencia.rfcCurpBeneficiario = dato.rfcCurpBeneficiario;
						transferencia.emailBeneficiario = dato.emailBeneficiario;
						const tipoCuentaBeneficiario2 = '';
						const nombreBeneficiario2 = '';
						const cuentaBeneficiario2 = '';
						const rfcCurpBeneficiario2 = '';
						transferencia.conceptoPago = dato.conceptoPago;
						const conceptoPago2 = '';
						const claveUsuario = '';
						const claveUsuario2 = '';
						const clavePago = '';
						const refCobranza = '';
						transferencia.referenciaNumerica = dato.referenciaNumerica;
						const tipoOperacion = '';
						transferencia.topologia = 'T';
						const usuario = '';
						transferencia.medioEntrega = 3;
						transferencia.iva = parseFloat(dato.iva).toFixed(2);
						const prioridad = '';
						transferencia.estatus = true;
						transferencia.estatus_stp = 'Pendiente';
						var fecha = new Date();
						var fechaMX = moment(fecha).tz('America/Mexico_City');
						transferencia.timestamp = fechaMX._d;
						transferencia.idSTP = '';
						transferencia.descripcionError = '';
						transferencia.resultado = '';
						transferencia.medio = 'Dispersion';
						transferencia.entorno = node_env;
						// 1. Obtención de la cadena original.
						var cadenaOriginal = `||${transferencia.institucionContraparte}|`;
						cadenaOriginal += `${transferencia.empresa}|`;
						cadenaOriginal += `${transferencia.fechaOperacion}|`;
						cadenaOriginal += `${folioOrigen}|`;
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
						cadenaOriginal += `${tipoCuentaBeneficiario2}|`;
						cadenaOriginal += `${nombreBeneficiario2}|`;
						cadenaOriginal += `${cuentaBeneficiario2}|`;
						cadenaOriginal += `${rfcCurpBeneficiario2}|`;
						cadenaOriginal += `${transferencia.conceptoPago}|`;
						cadenaOriginal += `${conceptoPago2}|`;
						cadenaOriginal += `${claveUsuario}|`;
						cadenaOriginal += `${claveUsuario2}|`;
						cadenaOriginal += `${clavePago}|`;
						cadenaOriginal += `${refCobranza}|`;
						cadenaOriginal += `${transferencia.referenciaNumerica}|`;
						cadenaOriginal += `${tipoOperacion}|`;
						cadenaOriginal += `${transferencia.topologia}|`;
						cadenaOriginal += `${usuario}|`;
						cadenaOriginal += `${transferencia.medioEntrega}|`;
						cadenaOriginal += `${prioridad}|`;
						cadenaOriginal += `${transferencia.iva}||`;
						const private_key = fs.readFileSync(certificado, 'utf-8');
						const signer = crypto.createSign('sha256');
						console.log(cadenaOriginal);
						signer.update(cadenaOriginal);
						signer.end();
						const signature = signer.sign(
							{
								key: private_key,
								passphrase: passphrase,
							},
							'base64'
						);
						console.log(signature);
						transferencia.firma = signature;
						transferencia.idDispersion = dispersion._id;
						const newTransfer = await transferencia.save();
						dispersion.idTransferencia.push(newTransfer._id);
					} //FIN  DEL FOREACH

					const newDisp = await dispersion.save();
					const close = await mongo.close();
					return res.status(200).send(data);
				}
			);
			return;
		});
		//const close = await mongo.close();
	},

	getTransferenciasC: async (req, res) => {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const transferencias = Transferencia.find({
			estatus_stp: 'Cancelada',
		}).exec(async (err, transferencias) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			return res.status(200).send(transferencias);
		});
	},
	hide: async (req, res) => {
		var transID = req.params.id;
		const estatusCancel = 'Cancelada';

		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const dispersiones = Dispersion.findOneAndUpdate(
			{
				_id: transID,
			},
			{
				estatus: false,
			},
			(err, transferenciaUpdated) => {
				Transferencia.updateMany(
					{
						idDispersion: transID,
					},
					{
						estatus_stp: estatusCancel,
						estatus: false,
						estatus_stp: 'Ejecución Cancelada',
					},
					async (err, transferenciaUpdated) => {
						const close = await mongo.close();
						return res.status(200).send('Dispersion Cancelada Correctamente');
					}
				);
			}
		);
	},
	getAllDispersion: async (req, res) => {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		await Dispersion.find({
			estatus: true,
		}).exec(async (err, registros) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			return res.status(200).send(registros);
		});
	},
	buscarDispersion: async (req, res) => {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		var searchString = req.params.search;

		const dispersion = Dispersion.find({
			_id: searchString,
		}).exec(async (err, dispersion) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			return res.status(200).send(dispersion);
		});
	},
	getDispersiones: async (req, res) => {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const dispersiones = Dispersion.find({
			estatus: true,
			estatus_stp: 'Pendiente',
		})
			.populate('idTransferencia')
			.exec(async (err, registros) => {
				const close = await mongo.close();

				if (err) return res.status(500).send({});

				return res.status(200).send(registros);
			});
	},
	ejecutar: async (req, res) => {
		// 1 - obtener ID DE DISPERSION A EJECUTAR
		const { id: idDispersion } = req.params;

		// 2 - CONEXIÓN A BD
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		try {
			// 3 - BUSCAR TRANSFERENCIAS DE DISPERSION
			const query = { estatus: true, idDispersion };
			const transferencias = await Transferencia.find(query, {
				idSTP: 0,
				idDispersion: 0,
				entorno: 0,
				medio: 0,
				descripcionError: 0,
				resultado: 0,
				timestamp: 0,
				estatus_stp: 0,
				estatus: 0,
				folioOrigen: 0,
			});

			if (!transferencias) return res.status(404).send('No se han encontrado resultados');

			// AGENTE PARA AUTORIZAR CONEXIONES HTTPS Y HTTP
			const agent = new https.Agent({ rejectUnauthorized: false });
			// 4 - EJECUTAR TRANSEFERENCIAS (UNA POR UNA)
			for await (const transferencia of transferencias) {
				const query = { estatus_stp: 'Ejecutada' };

				const { status, data } = await axios.put(endpoint_stp, transferencia, {
					httpsAgent: agent,
				});

				console.log(transferencia);
				if (status !== 200) query.estatus_stp = 'Error';

				// 5 - ACTUALIZAR DATOS DE TRANSFERENCIA
				query.descripcionError = data.resultado.descripcionError;
				query.idSTP = data.resultado.id;
				await Transferencia.findOneAndUpdate({ _id: transferencia._id }, query);
			}
			// 6 - ACUTALIZAR ESTATUS DE DISPERSION
			const dispersion = await Dispersion.findOneAndUpdate({ _id: idDispersion }, { estatus_stp: 'Ejecutada' });

			// 7 - CERRAR CONEXIÓN DE BD
			await mongo.close();
			return res.send('Dispersión procesada correctamente');
		} catch (error) {
			console.log(error);
			await mongo.close();
			return res.status(500).send('Error interno');
		}
	},
};

module.exports = controller;
