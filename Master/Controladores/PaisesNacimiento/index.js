'use strict';

const PaisNacimiento = require('./../../Modelos/PaisesNacimiento');
const MongooseConnect = require('./../../MongooseConnect');
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
if (node_env == 'production') {
	var data = envJSON[node_env].METADATA_P;
} else {
	var data = envJSON[node_env].METADATA_D;
}

const controller = {
	getPaisesNacimiento: async (req, res) => {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const query = PaisNacimiento.find({ pais: 'MEXICO' });
		query.sort('pais').exec(async (err, paisesNacimiento) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!paisesNacimiento) return res.status(404).send({});

			return res.status(200).send(paisesNacimiento);
		});
	},
};

module.exports = controller;
