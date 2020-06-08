'use strict';

const ActividadEconomica = require('./../../Modelos/ActividadesEconomicas');
const MongooseConnect = require('./../../MongooseConnect');
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
if (node_env == 'production') {
	var data = envJSON[node_env].METADATA_P;
} else {
	var data = envJSON[node_env].METADATA_D;
}

const ControllerActividadesEconomicas = {
	getActividadesEconomicas: async (req, res) => {
		const SERVER_BD = req.user[`${data}`].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		const query = ActividadEconomica.find({});
		query.sort('actividadEconomica').exec(async (err, actividadEconomica) => {
			const close = await mongo.close();

			if (err) return res.status(500).send({});

			if (!actividadEconomica) return res.status(404).send({});

			return res.status(200).send(actividadEconomica);
		});
	},
};

module.exports = ControllerActividadesEconomicas;
