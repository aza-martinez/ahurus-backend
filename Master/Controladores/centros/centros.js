const validator = require('validator');
const CC = require('../../Modelos/centros/centros');
const MongooseConnect = require('./../../MongooseConnect');

const controller = {
	save: (req, res) => {
		var params = req.body;
		var centro = new CC();
		centro.razon_social = params.razon_social;
		centro.nombreCentro = params.nombreCentro;
		centro.rfcCentro = params.rfcCentro;
		centro.domicilioCentro = params.domicilioCentro;
		centro.numeroCentro = params.numeroCentro;
		centro.nombre_contacto = params.nombre_contacto;
		centro.correo_contacto = params.correo_contacto;
		centro.telefono_contacto = params.telefono_contacto;
		centro.ctf = params.ctf;
		centro.tipocuenta = params.tipocuenta;
		centro.telefono_contacto = params.telefono_contacto;
		centro.estatus = true;
		var fecha = new Date();
		var fechaMX = moment(fecha).tz('America/Mexico_City');
		centro.timestamp = fechaMX._d;
		centro.cuenta_stp = params.cuenta_stp;
		centro.save((err, centroStored) => {
			if (err || !centroStored) {
				return res.status(404).send({});
			}
			return res.status(200).send({
				...centroStored._doc,
			});
		});
	},

	getCCA: async (req, res) => {
		const mongo = new MongooseConnect();
		const SERVER_BD = loginEmpresa.empresa;
		const cnx = await mongo.connect(SERVER_BD);
		try {
			const centro = await CC.find({ estatus: true });

			if (!centro) return res.status(404).send({});

			await mongo.close();
			return res.status(200).send({ centro });
		} catch (error) {
			return res.status(500).send('ERROR INTERNO');
		}
	},
	update: (req, res) => {
		var centroId = req.params.id;
		var params = req.body;
		try {
			!validator.isEmpty(params.estatus);
			var fecha = new Date();
			var fechaMX = moment(fecha).tz('America/Mexico_City');
			centro.timestamp = fechaMX._d;
		} catch (err) {
			return res.status(200).send({});
		}
		CC.findOneAndUpdate(
			{
				_id: centroId,
			},
			params,
			{
				new: true,
			},
			(err, centroUpdated) => {
				if (err) {
					return res.status(500).send({});
				}
				if (!centroUpdated) {
					return res.status(404).send({});
				}
				return res.status(200).send({
					centroUpdated,
				});
			}
		);
	},
	getCCI: (req, res) => {
		var query = CC.find({
			estatus: false,
		});
		var last = req.params.last;
		if (last || last != undefined) {
			query.limit(5);
		}
		query.sort('-_id').exec((err, centro) => {
			if (err) {
				return res.status(500).send({});
			}
			if (!centro) {
				return res.status(404).send({});
			}
			return res.status(200).send({
				...centro,
			});
		});
	},

	getCC: (req, res) => {
		var centroID = req.params.id;

		CC.findById(centroID, (err, centro) => {
			if (err || !centroID) {
				return res.status(404).send({});
			}
			return res.status(200).send({
				centro,
			});
		});
	},

	search: (req, res) => {
		var searchString = req.params.search;
		centro
			.find({
				$or: [
					{
						razon_social: {
							$regex: searchString,
							$options: 'i',
						},
					},
				],
			})
			.sort([['date', 'descending']])
			.exec((err, centro) => {
				if (err) {
					return res.status(500).send({});
				}
				return res.status(200).send({
					centro,
				});
			});
	},
};

module.exports = controller;
