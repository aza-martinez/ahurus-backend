'use strict';

var validator = require('validator');
var Estado = require('../../Modelos/transferencias/cambiosEstados');
const moment = require('moment');

var controller = {
	update: (req, res) => {
		var estadoID = req.params.id;
		var params = req.body;
		try {
		} catch (err) {}
		var estado = new Estado();
		estado.Id = params.Id;
		estado.Empresa = params.Empresa;
		estado.folioOrigen = params.folioOrigen;
		estado.Estado = params.Estado;
		estado.causaDevolucion = params.causaDevolucion;
		var fecha = new Date();
		var fechaMX = moment(fecha).tz('America/Mexico_City');
		estado.timestamp = fechaMX._d;
		estado.findOneAndUpdate(
			{
				_id: estadoID,
			},
			params,
			{
				new: true,
			},
			(err, estadoUpdated) => {
				if (err) {
					return res.status(500).send({});
				}

				if (!estadoUpdated) {
					return res.status(404).send({});
				}
				return res.status(200).send({
					estadoUpdated,
				});
			}
		);
	},
};
module.exports = controller;
