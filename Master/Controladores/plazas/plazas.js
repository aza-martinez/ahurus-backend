'use strict';

var validator = require('validator');
var Plaza = require('../../Modelos/plazas/plazas');

var controller = {
	save: (req, res) => {
		var params = req.body;
		try {
			!validator.isEmpty(params.numero);
			!validator.isEmpty(params.nombre);
		} catch (err) {
			return res.status(200).send({});
		}
		var plaza = new Plaza();
		plaza.nombre = params.nombre;
		plaza.numero = params.numero;
		plaza.save((err, plazaStored) => {
			if (err || !plazaStored) {
				return res.status(404).send({});
			}
			return res.status(200).send({ ...plazaStored._doc });
		});
	},

	getPlazas: (req, res) => {
		var query = Plaza.find({});
		var last = req.params.last;
		if (last || last != undefined) {
			query.limit(5);
		}
		query.sort('-_id').exec((err, plazas) => {
			if (err) {
				return res.status(500).send({});
			}
			if (!plazas) {
				return res.status(404).send({});
			}

			return res.status(200).send({ plazas });
		});
	},

	getPlaza: (req, res) => {
		var plazaId = req.params.id;
		if (!plazaId || plazaId == null) {
			return res.status(404).send({});
		}
		Plaza.findById(plazaId, (err, plaza) => {
			if (err || !plazaId) {
				return res.status(404).send({});
			}

			return res.status(200).send({ ...plaza._doc });
		});
	},

	search: (req, res) => {
		var searchString = req.params.search;
		Plaza.find({
			$or: [{ nombre: { $regex: searchString, $options: 'i' } }, { numero: { $regex: searchString, $options: 'i' } }],
		})
			.sort([['date', 'descending']])
			.exec((err, plazas) => {
				if (err) {
					return res.status(500).send({});
				}
				if (!plazas || plazas.length <= 0) {
					return res.status(404).send({});
				}
				return res.status(200).send({ plazas });
			});
	},
}; // end controller

module.exports = controller;
