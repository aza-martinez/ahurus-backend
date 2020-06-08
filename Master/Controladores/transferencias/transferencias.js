'use strict';
const https = require('https');
const Transferencia = require('../../Modelos/transferencias/transferencias');
const CentroCosto = require('./../../Modelos/centros/centros');
const MongooseConnect = require('./../../MongooseConnect');
const PDFGenerator = require('../../helpers/PDFGenerator/PDFGenerator');
const path = require('path');
const DateGenerator = require('../../helpers/DateGenerator');
const hbs = require('nodemailer-express-handlebars');
const Mailer = require('./../../helpers/Mailer');
const moment = require('moment');
const momentz = require('moment-timezone');
const Counter = require('../../Modelos/counters/counters');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';

if (node_env == 'production') {
	var certificado = envJSON[node_env].CERTS_URL_P;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_P;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_P;
	var data = envJSON[node_env].METADATA_P;
} else {
	var certificado = envJSON[node_env].CERTS_URL_D;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_D;
	var data = envJSON[node_env].METADATA_D;
}

const controller = {
	save: async (req, res) => {
		var params = req.body;
		const user = req.user[`${data}`].user;
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		console.log(SERVER_BD);
		let nombreEmpresa;
		if (node_env == 'development' && SERVER_BD == 'demo') {
			nombreEmpresa = 'DEMOAHURUS';
		} else {
			nombreEmpresa = params.centro_costo.nombreCentro;
		}

		Counter.findByIdAndUpdate(
			{
				_id: 'transferencias',
			},
			{
				$inc: {
					invoice: 1,
				},
			},
			function(error, counter) {
				if (error) return next(error);
				let mail;
				if (params.mail === undefined || params.mail === false) {
					mail = false;
				} else {
					mail = true;
				}
				let last_invoice = counter.invoice + 1;
				const transferencias = new Transferencia();
				//INICIO
				transferencias.institucionContraparte = params.cuenta.institucion.clabe;
				transferencias.empresa = params.centro_costo.nombreCentro;
				transferencias.mail = mail;
				transferencias.usuario = user;
				transferencias.fechaOperacion = params.fecha_aplicacion;
				const folioOrigen = '';
				transferencias.claveRastreo = nombreEmpresa + last_invoice;
				transferencias.institucionOperante = 90646;
				transferencias.monto = parseFloat(params.importe).toFixed(2);
				transferencias.tipoPago = 1;
				transferencias.tipoCuentaOrdenante = params.cuenta.tipo_cuenta.clave;
				transferencias.nombreOrdenante = params.centro_costo.razon_social;
				transferencias.cuentaOrdenante = params.centro_costo.cuenta_stp;
				transferencias.rfcCurpOrdenante = params.centro_costo.rfcCentro;
				transferencias.tipoCuentaBeneficiario = params.cuenta.tipo_cuenta.clave;
				transferencias.nombreBeneficiario = params.propietario.razon_social || params.propietario.nombreCompleto;
				transferencias.cuentaBeneficiario = params.cuenta.clabe;
				transferencias.rfcCurpBeneficiario = params.propietario.rfc;
				transferencias.emailBeneficiario = params.propietario.correo1;
				const tipoCuentaBeneficiario2 = '';
				const nombreBeneficiario2 = '';
				const cuentaBeneficiario2 = '';
				const rfcCurpBeneficiario2 = '';
				transferencias.conceptoPago = params.conceptoPago;
				const conceptoPago2 = '';
				const claveUsuario = '';
				const claveUsuario2 = '';
				const clavePago = '';
				const refCobranza = '';
				transferencias.referenciaNumerica = params.numero_referencia;
				const tipoOperacion = '';
				transferencias.topologia = 'T';
				const usuario = '';
				transferencias.medioEntrega = 3;
				transferencias.iva = parseFloat(params.iva).toFixed(2);
				const prioridad = '';
				transferencias.estatus = true;
				transferencias.estatus_stp = 'Pendiente';
				var fecha = new Date();
				var fechaMX = moment(fecha).tz('America/Mexico_City');
				transferencias.timestamp = fechaMX._d;
				transferencias.idSTP = '';
				transferencias.descripcionError = '';
				transferencias.resultado = '';
				transferencias.medio = 'Transferencia';
				transferencias.entorno = node_env;

				// 1. Obtención de la cadena original.
				var cadenaOriginal = `||${transferencias.institucionContraparte}|`;
				cadenaOriginal += `${transferencias.empresa}|`;
				cadenaOriginal += `${transferencias.fechaOperacion}|`;
				cadenaOriginal += `${folioOrigen}|`;
				cadenaOriginal += `${transferencias.claveRastreo}|`;
				cadenaOriginal += `${transferencias.institucionOperante}|`;
				cadenaOriginal += `${transferencias.monto}|`;
				cadenaOriginal += `${transferencias.tipoPago}|`;
				cadenaOriginal += `${transferencias.tipoCuentaOrdenante}|`;
				cadenaOriginal += `${transferencias.nombreOrdenante}|`;
				cadenaOriginal += `${transferencias.cuentaOrdenante}|`;
				cadenaOriginal += `${transferencias.rfcCurpOrdenante}|`;
				cadenaOriginal += `${transferencias.tipoCuentaBeneficiario}|`;
				cadenaOriginal += `${transferencias.nombreBeneficiario}|`;
				cadenaOriginal += `${transferencias.cuentaBeneficiario}|`;
				cadenaOriginal += `${transferencias.rfcCurpBeneficiario}|`;
				cadenaOriginal += `${transferencias.emailBeneficiario}|`;
				cadenaOriginal += `${tipoCuentaBeneficiario2}|`;
				cadenaOriginal += `${nombreBeneficiario2}|`;
				cadenaOriginal += `${cuentaBeneficiario2}|`;
				cadenaOriginal += `${rfcCurpBeneficiario2}|`;
				cadenaOriginal += `${transferencias.conceptoPago}|`;
				cadenaOriginal += `${conceptoPago2}|`;
				cadenaOriginal += `${claveUsuario}|`;
				cadenaOriginal += `${claveUsuario2}|`;
				cadenaOriginal += `${clavePago}|`;
				cadenaOriginal += `${refCobranza}|`;
				cadenaOriginal += `${transferencias.referenciaNumerica}|`;
				cadenaOriginal += `${tipoOperacion}|`;
				cadenaOriginal += `${transferencias.topologia}|`;
				cadenaOriginal += `${usuario}|`;
				cadenaOriginal += `${transferencias.medioEntrega}|`;
				cadenaOriginal += `${prioridad}|`;
				cadenaOriginal += `${transferencias.iva}||`;
				const private_key = fs.readFileSync(certificado, 'utf-8');
				const signer = crypto.createSign('sha256');
				console.log(cadenaOriginal);
				console.log(transferencias.mail);
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
				transferencias.firma = signature;
				transferencias.save(async (err, transferenciaStored) => {
					const close = await mongo.close();

					if (err || !transferenciaStored) return res.status(400).send(err);
					return res.status(200).send({
						...transferenciaStored._doc,
					});
				});
			}
		);
	},

	async ejecutar(req, res) {
		var transID = req.params.id;

		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});

		Transferencia.findById(transID, async (err, transferenciaFind) => {
			const estatusError = 'Error';
			const estatusOk = 'Ejecutada';
			const transferencia = {
				...transferenciaFind._doc,
			};

			delete transferencia.estatus_stp;
			delete transferencia.timestamp;
			delete transferencia.idSTP;
			delete transferencia.descripcionError;
			delete transferencia.resultado;
			delete transferencia.medio;
			delete transferencia.estatus;
			delete transferencia._id;
			delete transferencia.mail;
			delete transferencia.entorno;
			delete transferencia.usuario;
			console.log(transferencia);
			await axios
				.put(endpoint_stp, transferencia, {
					httpsAgent: agent,
				})
				.then(response => {
					if (response.data.resultado.descripcionError) {
						Transferencia.findOneAndUpdate(
							{
								_id: transID,
							},
							{
								descripcionError: response.data.resultado.descripcionError,
								idSTP: response.data.resultado.id,
								estatus_stp: estatusError,
							},
							async (err, transferenciaUpdated) => {
								const close = await mongo.close();
								return res.status(400).send('ERROR: ' + response.data.resultado.descripcionError);
							}
						);
					}
					console.log(response.data);
					if (!response.data.resultado.descripcionError) {
						Transferencia.findOneAndUpdate(
							{
								_id: transID,
							},
							{
								descripcionError: response.data.resultado.descripcionError,
								idSTP: response.data.resultado.id,
								estatus_stp: estatusOk,
							},
							async (err, transferenciaUpdated) => {
								const close = await mongo.close();
								return res.status(200).send('EJECUTADA CON EL ID: ' + response.data.resultado.id);
							}
						);
					}
				})
				.catch(async error => {
					const close = await mongo.close();
					return res.status(400).send(error);
				});
		});
	},
	update: async (req, res) => {
		var tranferenciaID = req.params.id;
		var params = req.body;

		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const transferencias = new Transferencia();
		transferencias.claveRastreo = params.claveRastreo;
		transferencias.conceptoPago = params.conceptoPago;
		const conceptoPago2 = '';
		transferencias.cuentaBeneficiario = params.cuentaBeneficiario;
		const cuentaBeneficiario2 = '';
		transferencias.cuentaOrdenante = params.cuentaOrdenante;
		transferencias.emailBeneficiario = params.emailBeneficiario;
		transferencias.empresa = params.empresa;
		transferencias.fechaOperacion = params.fechaOperacion;
		const folioOrigen = '';
		transferencias.mail = params.mail;
		transferencias.institucionContraparte = params.institucionContraparte;
		transferencias.institucionOperante = '90646';
		transferencias.monto = parseFloat(params.monto).toFixed(2);
		transferencias.nombreBeneficiario = params.nombreBeneficiario;
		const nombreBeneficiario2 = '';
		transferencias.nombreOrdenante = params.nombreOrdenante;
		transferencias.rfcCurpBeneficiario = params.rfcCurpBeneficiario;
		const rfcCurpBeneficiario2 = '';
		transferencias.rfcCurpOrdenante = params.rfcCurpOrdenante;
		transferencias.tipoCuentaBeneficiario = params.tipoCuentaBeneficiario;
		const tipoCuentaBeneficiario2 = '';
		transferencias.tipoCuentaOrdenante = params.tipoCuentaOrdenante;
		transferencias.tipoPago = '1';
		transferencias.estatus = true;
		const claveUsuario = '';
		const claveUsuario2 = '';
		const clavePago = '';
		const refCobranza = '';
		transferencias.referenciaNumerica = params.referenciaNumerica;
		const tipoOperacion = '';
		transferencias.topologia = 'T';
		const usuario = '';
		transferencias.medioEntrega = '3';
		const prioridad = '';
		transferencias.iva = parseFloat(params.iva).toFixed(2);
		transferencias.estatus_stp = 'Pendiente';
		var fecha = new Date();
		var fechaMX = moment(fecha).tz('America/Mexico_City');
		transferencias.timestamp = fechaMX._d;
		const id = '';
		const descripcionError = '';
		const resultado = '';
		transferencias.medio = 'Transferencia';

		var cadenaOriginal = `||${transferencias.institucionContraparte}|`;
		cadenaOriginal += `${transferencias.empresa}|`;
		cadenaOriginal += `${transferencias.fechaOperacion}|`;
		cadenaOriginal += `${folioOrigen}|`;
		cadenaOriginal += `${transferencias.claveRastreo}|`;
		cadenaOriginal += `${transferencias.institucionOperante}|`;
		cadenaOriginal += `${transferencias.monto}|`;
		cadenaOriginal += `${transferencias.tipoPago}|`;
		cadenaOriginal += `${transferencias.tipoCuentaOrdenante}|`;
		cadenaOriginal += `${transferencias.nombreOrdenante}|`;
		cadenaOriginal += `${transferencias.cuentaOrdenante}|`;
		cadenaOriginal += `${transferencias.rfcCurpOrdenante}|`;
		cadenaOriginal += `${transferencias.tipoCuentaBeneficiario}|`;
		cadenaOriginal += `${transferencias.nombreBeneficiario}|`;
		cadenaOriginal += `${transferencias.cuentaBeneficiario}|`;
		cadenaOriginal += `${transferencias.rfcCurpBeneficiario}|`;
		cadenaOriginal += `${transferencias.emailBeneficiario}|`;
		cadenaOriginal += `${tipoCuentaBeneficiario2}|`;
		cadenaOriginal += `${nombreBeneficiario2}|`;
		cadenaOriginal += `${cuentaBeneficiario2}|`;
		cadenaOriginal += `${rfcCurpBeneficiario2}|`;
		cadenaOriginal += `${transferencias.conceptoPago}|`;
		cadenaOriginal += `${conceptoPago2}|`;
		cadenaOriginal += `${claveUsuario}|`;
		cadenaOriginal += `${claveUsuario2}|`;
		cadenaOriginal += `${clavePago}|`;
		cadenaOriginal += `${refCobranza}|`;
		cadenaOriginal += `${transferencias.referenciaNumerica}|`;
		cadenaOriginal += `${tipoOperacion}|`;
		cadenaOriginal += `${transferencias.topologia}|`;
		cadenaOriginal += `${usuario}|`;
		cadenaOriginal += `${transferencias.medioEntrega}|`;
		cadenaOriginal += `${prioridad}|`;
		cadenaOriginal += `${transferencias.iva}||`;

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
		params.firma = signature;
		transferencias.firma = signature;
		Transferencia.findOneAndUpdate(
			{
				_id: tranferenciaID,
			},
			params,
			{
				new: true,
			},
			async (err, transferenciaUpdated) => {
				const close = await mongo.close();

				if (err)
					return res.status(500).send({
						err,
					});

				if (!transferenciaUpdated)
					return res.status(404).send({
						err,
					});

				return res.status(200).send({
					transferenciaUpdated,
				});
			}
		);
	},

	hide: async (req, res) => {
		var transID = req.params.id;
		const estatusCancel = 'Cancelada';

		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		Transferencia.findOneAndUpdate(
			{
				_id: transID,
			},
			{
				estatus_stp: estatusCancel,
				estatus: false,
			},
			async (err, transferenciaUpdated) => {
				const close = await mongo.close();
				return res.status(200).send('Transferencia Cancelada.');
			}
		);
	},

	getTransferencia: (req, res) => {
		var searchString = req.params.search;
		Transferencia.find({
			rfcCurpBeneficiario: searchString,
		}).exec((err, transferencias) => {
			if (err) {
				return res.status(500).send({});
			}

			if (!transferencias || transferencias.length <= 0) {
			}

			return res.status(200).send(transferencias);
		});
	},
	getTransferenciasA: async (req, res) => {
		const now = new Date();
		const fechaMX = moment(now)
			.tz('America/Mexico_City')
			.format('YYYYMMDD');
		const SERVER_BD = req.user[`${data}`].empresa;
		console.log(SERVER_BD);
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		await Transferencia.find({
			estatus_stp: 'Pendiente',
			medio: 'Transferencia',
			estatus: true,
			fechaOperacion: {
				$gte: fechaMX,
			},
		})
			.sort([['date', 'descending']])
			.exec(async (err, Transferencias) => {
				const close = await mongo.close();
				if (err) return res.status(500).send({});

				if (!Transferencias && Transferencias.length <= 0) return res.status(404).send({});

				return res.status(200).send(Transferencias);
			});
	},

	getTransferenciasDispersion: async (req, res) => {
		var id = req.params.id;
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);
		await Transferencia.find({
			medio: 'Dispersion',
			idDispersion: id,
		})
			.sort([['date', 'descending']])
			.exec(async (err, Transferencias) => {
				const close = await mongo.close();
				return res.status(200).send(Transferencias);
			});
	},
	response: async (req, res) => {
		// DESTRUCTURING CAMBIO DE ESTADO
		let { id, empresa, estado, detalle, folioOrigen } = req.body;
		const mongo = new MongooseConnect();
		console.log(id, empresa, estado, detalle, folioOrigen);
		if (node_env == 'development') {
			await mongo.connect('demo');
		} else {
			await mongo.connect(empresa.toLowerCase());
		}
		try {
			// CONSULTAMOS QUE EXISTA LA TRANSFERENCIA SEGUN ID DE CAMBIO DE ESTADO
			let transferencia = await Transferencia.findOne({
				idSTP: id,
				empresa: empresa,
			});
			console.log(transferencia);
			if (!transferencia) return res.status(404).send('La transferencia que intenta actualizar no existe');

			const now = new Date();
			const fechaMX = moment(now).tz('America/Mexico_City');

			transferencia = await Transferencia.findByIdAndUpdate(
				{ _id: transferencia.id },
				{
					estatus_stp: estado,
					timestamp: fechaMX._d,
					descripcionError: detalle,
				},
				{ new: true }
			);

			if (!transferencia) return res.status(404).send('No se ha podido realizar la actualización.');

			// GENERAMOS PDF Y SE ENVÍA EMAIL
			const centroCosto = await CentroCosto.findOne({
				nombreCentro: transferencia.empresa,
			});
			console.log(transferencia);
			if (transferencia.mail === true || transferencia.mail === undefined) {
				const newMail = await new Mailer(transferencia, centroCosto);
				const mail = await newMail.send();
			} else {
				//const mail = await newMail.send();
			}
			return res.status(200).send({
				estado: 'Exito',
			});
		} catch (error) {
			await mongo.close();
			console.log(error);
			return res.status(500).send('Error Interno');
		}
	},

	generatePDF: async (req, res) => {
		const { idSTP, empresa, estado, detalle, folioOrigen } = req.body;
		let id = req.params.id;
		const mongo = new MongooseConnect();
		if (node_env == 'development') {
			await mongo.connect('demo');
		} else {
			await mongo.connect(empresa.toLowerCase());
		}
		try {
			console.log(id);
			// CONSULTAMOS QUE EXISTA LA TRANSFERENCIA SEGUN ID DE CAMBIO DE ESTADO
			let transferencia = await Transferencia.findById({ _id: id });
			if (!transferencia) return res.status(404).send('La transferencia de la cual solicita el PDF no existe');

			await mongo.close();
			let pdfg = new PDFGenerator(transferencia);
			const PDF = await pdfg.getPDFTrans();
			console.log(PDF);
			res.set({ 'Content-Type': 'application/pdf', 'Content-Length': PDF.length });
			return res.status(200).send(PDF);
		} catch (error) {
			await mongo.close();
			console.log(error);
			return res.status(500).send('Error Interno');
		}
	},
	getTransferenciasC: (req, res) => {
		Transferencia.find({
			estatus_stp: 'Cancelada',
		})
			.sort([['date', 'descending']])
			.exec((err, transferencias) => {
				if (err) {
					return res.status(500).send({});
				}
				if (!transferencias || transferencias.length <= 0) {
				}
				return res.status(200).send(transferencias);
			});
	},

	getTransferencias: (req, res) => {
		Transferencia.find({
			medio: 'Transferencia',
		})
			.sort([['date', 'descending']])
			.exec((err, transferencias) => {
				if (err) {
					return res.status(500).send({});
				}
				if (!transferencias || transferencias.length <= 0) {
				}
				return res.status(200).send(transferencias);
			});
	},
	buscarTransferencia: (req, res) => {
		var id = req.params.id;
		Transferencia.find({
			_id: id,
		}).exec((err, transferencias) => {
			if (err) {
				return res.status(500).send({});
			}
			if (!transferencias || transferencias.length <= 0) {
			}
			return res.status(200).send(transferencias);
		});
	},
};
module.exports = controller;
