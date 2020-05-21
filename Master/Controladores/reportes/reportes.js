'use strict';

const Transferencia = require('../../Modelos/transferencias/transferencias');
const Dispersion = require('../../Modelos/dispersiones/dispersiones');
const MongooseConnect = require('./../../MongooseConnect');
const moment = require('moment');
const momentz = require('moment-timezone');
const Counter = require('../../Modelos/counters/counters');
const fs = require('fs');
var path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const https = require('https');
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
const DateGenerator = require('./../../helpers/DateGenerator');

if (node_env == 'production') {
	var certificado = envJSON[node_env].CERTS_URL_P;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_P;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_P;
	var endpoint_stp_track = envJSON[node_env].ENDPOINT_STP_TRACK_P;
	var endpoint_stp_balance = envJSON[node_env].ENDPOINT_STP_BALANCE_P;
} else {
	var certificado = envJSON[node_env].CERTS_URL_D;
	var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
	var endpoint_stp = envJSON[node_env].ENDPOINT_STP_D;
	var endpoint_stp_track = envJSON[node_env].ENDPOINT_STP_TRACK_D;
	var endpoint_stp_balance = envJSON[node_env].ENDPOINT_STP_BALANCE_D;
}

var controller = {
	getReportTransfer: async (req, res) => {
		// Conexión a la BD
		//const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect('sefince');

		try {
			const params = req.body;
			const { fechaInicial, fechaFinal, filtro, empresa, claveRastreo } = params;

			let query = { medio: 'Transferencia' };

			if (!claveRastreo) {
				if (filtro && filtro !== 'ALL') query.estatus_stp = filtro;
				if (empresa) query.empresa = empresa;
				if (fechaInicial) query.fechaOperacion = { $gte: fechaInicial };
				if (fechaFinal) query.fechaOperacion = { ...query.fechaOperacion, $lte: fechaFinal };
			} else {
				query.claveRastreo = claveRastreo;
			}

			const transferencias = await Transferencia.find(query);

			await mongo.close();

			if (!transferencias) return res.status(400);

			return res.send(transferencias);
		} catch (error) {
			await mongo.close();
			return res.status(500).send('Error interno');
		}
	},
	getBalance: async (req, res) => {
		var params = req.body;
		const SERVER_BD = 'SEFINCE'; //req.user['http://localhost:3000/user_metadata'].empresa;
		const cuentaOrdenante = params.cuentaOrdenante; // ejemplo: '20190326'
		let cadenaOriginal = cuentaOrdenante;
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
		var consultaSaldoCuenta = {
			cuentaOrdenante: cuentaOrdenante,
			firma: signature,
		};

		//const agent = (https.globalAgent.options.rejectUnauthorized = false);
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		await axios
			.post(endpoint_stp_balance, consultaSaldoCuenta, {
				httpsAgent: agent,
			})
			.then(response => {
				if (response) {
					return res.status(200).send(response.data.resultado);
				}

				if (!response) {
					return res.status(200).send(response.data.resultado);
				}
			})
			.catch(async error => {
				return res.status(400).send(error);
			});
	},

	getReportDisper: async (req, res) => {
		//const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect('sefince');

		try {
			const { fechaInicial, fechaFinal, estatus } = req.body;
			const query = {};

			//estatus debe ser obligatorio
			console.log(estatus);
			if (!estatus) return res.status(404).send('No se enviaron parametros necesarios');

			query.estatus_stp = estatus;

			if (fechaInicial) query.fechaOperacion = { $gte: fechaInicial };
			if (fechaFinal) query.fechaOperacion = { ...query.fechaOperacion, $lte: fechaFinal };
			console.log(query);
			const dispersiones = await Dispersion.find(query).populate('idTransferencia');
			await mongo.close();

			if (!dispersiones) return res.status(404).send('No se ha podido realizar la consulta');

			return res.send(dispersiones);
		} catch (error) {
			console.log(error);
			await mongo.close();
			return res.status(500).send('Error Interno');
		}
	},
};

module.exports = controller;
