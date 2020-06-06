'use strict';

var Errores = require('../../Modelos/errores/errores');
const MongooseConnect = require('./../../MongooseConnect');

var controller = {
	save: async (req, res) => {
		const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
		const mongo = new MongooseConnect();
		await mongo.connect(SERVER_BD);

		var params = req.body;
		var errores = new Errores();
		errores.clave = params.clave;
		errores.descripcion = params.descripcion;

		errores.save(async (err, erroresStored) => {
			if (err || !erroresStored) return res.status(404).send({});

			return res.status(200).send({ ...erroresStored._doc });
		});
	},

	getErrores: (req, res) => {
		var query = Errores.find({});
		var last = req.params.last;
		if (last || last != undefined) {
			query.limit(5);
		}
		query.sort('-_id').exec((err, errores) => {
			if (err) {
				return res.status(500).send({});
			}
			return res.status(200).send([errores]);
		});
	},

	getError: (req, res) => {
		var errorId = req.params.id;
		Errores.findById(errorId, (err, errores) => {
			if (err || !errorId) {
				return res.status(404).send({});
			}
			return res.status(200).send({ errores });
		});
	},
};

module.exports = controller;
