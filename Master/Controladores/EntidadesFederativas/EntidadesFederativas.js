'use strict';

const EntidadFederativa = require('../../Modelos/EntidadesFederativas/EntidadesFederativas');
const MongooseConnect = require('./../../MongooseConnect');

const controller = {
	getEntidadesFederativas: async (req, res) => {
		const query = EntidadFederativa.find({});
		const SERVER_BD = req.user['https://ahurus.com/user'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		query.sort('entidad').exec(async (err, entidadesFederativas) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!entidadesFederativas) return res.status(404).send({});

			return res.status(200).send(entidadesFederativas);
		});
	},
};

module.exports = controller;
