'use strict';

var validator = require('validator');
var Tipo = require('../../Modelos/tipos_cuentas/tipos_cuentas');
const MongooseConnect = require('./../../MongooseConnect');

var controller = {
	save: async (req, res) => {
		var params = req.body;
		try {
			!validator.isEmpty(params.clave);
			!validator.isEmpty(params.descripcion);
		} catch (err) {
			return res.status(400).send({});
		}

		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		var tipo = new Tipo();
		tipo.clave = params.clave;
		tipo.descripcion = params.descripcion;
		tipo.estatus = true;
		var fecha = new Date();
		var fechaMX = moment(fecha).tz('America/Mexico_City');
		tipo.timestamp = fechaMX._d;
		const tipo_pago = tipo.save(async (err, tipoStored) => {
			const close = await mongo.close();

			if (err || !tipoStored) return res.status(404).send({});

			return res.status(200).send({
				...tipoStored._doc,
			});
		});
	},
	update: async (req, res) => {
		var tipoId = req.params.id;
		var params = req.body;
		try {
			!validator.isEmpty(params.estatus);
			var fecha = new Date();
			var fechaMX = moment(fecha).tz('America/Mexico_City');
			tipo.timestamp = fechaMX._d;
		} catch (err) {
			return res.status(200).send({});
		}
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const tipo_pago = Tipo.findOneAndUpdate(
			{
				_id: tipoId,
			},
			params,
			{
				new: true,
			},
			async (err, tipoUpdated) => {
				const close = await mongo.close();

				if (err) return res.status(500).send({});

				if (!tipoUpdated) return res.status(404).send({});

				return res.status(200).send({
					tipoUpdated,
				});
			}
		);
	},

	getTiposA: async (req, res) => {
		var query = Tipo.find({
			estatus: true,
		});
		var last = req.params.last;
		if (last || last != undefined) {
			query.limit(5);
		}

		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		query.sort('-_id').exec(async (err, tipos) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!tipos) return res.status(404).send({});

			return res.status(200).send([...tipos]);
		});
	},
	getTiposI: async (req, res) => {
		var query = Tipo.find({
			estatus: false,
		});
		var last = req.params.last;
		if (last || last != undefined) {
			query.limit(5);
		}

		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		query.sort('-_id').exec(async (err, tipos) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!tipos) return res.status(404).send({});

			return res.status(200).send([...tipos]);
		});
	},

	getTipo: async (req, res) => {
		var tipoId = req.params.id;

		if (!tipoId || tipoId == null) return res.status(404).send({});

		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const tipos_cuentas = Tipo.findById(tipoId, async (err, tipo) => {
			const close = await mongo.close();

			if (err || !tipoId) return res.status(404).send({});

			return res.status(200).send({
				...tipo._doc,
			});
		});
	},

	search: async (req, res) => {
		var searchString = req.params.search;
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const tipos_Cuentas = Tipo.find({
			$or: [
				{
					clave: {
						$regex: searchString,
						$options: 'i',
					},
				},
				{
					descripcion: {
						$regex: searchString,
						$options: 'i',
					},
				},
			],
		})
			.sort([['date', 'descending']])
			.exec(async (err, tipos) => {
				const close = await mongo.close();

				if (err) return res.status(500).send({});

				if (!tipos || tipos.length <= 0) return res.status(404).send({});

				return res.status(200).send({
					tipos,
				});
			});
	},
};

module.exports = controller;
