'use strict'

var validator = require('validator');
var Devolucion = require('../../Modelos/devoluciones/devoluciones');

var controller = {

    save: (req, res) => {
        var params = req.body;
        try {
            !validator.isEmpty(params.clave);
            !validator.isEmpty(params.descripcion);
        } catch (err) {
            return res.status(400).send({});
        }
        var devolucion = new Devolucion();
        devolucion.clave = params.clave;
        devolucion.descripcion = params.descripcion;
        devolucion.save((err, devolucionStored) => {

            if (err || !devolucionStored) {
                return res.status(404).send({});
            }
            return res.status(200).send({ ...devolucionStored._doc });
        });
    },

    getDevoluciones: (req, res) => {
        var query = Devolucion.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        query.sort('-_id').exec((err, devolucion) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!devolucion) {
                return res.status(404).send({});
            }
            return res.status(200).send([...devolucion]);
        });
    },

    getDevolucion: (req, res) => {
        var devolucionId = req.params.id;

        if (!devolucionId || devolucionId == null) {
            return res.status(404).send({});
        }
        Devolucion.findById(devolucionId, (err, devolucion) => {
            if (err || !devolucionId) {
                return res.status(404).send({});
            }
            return res.status(200).send({...devolucion._doc });
        });
    }

};

module.exports = controller;