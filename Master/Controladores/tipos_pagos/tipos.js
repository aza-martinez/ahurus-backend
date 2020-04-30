'use strict'

var validator = require('validator');
var TipoPago = require('../../Modelos/tipos_pagos/tipos');

var controller = {

    save: (req, res) => {
        var params = req.body;

        var tipo = new TipoPago();
        tipo.clave = params.clave;
        tipo.descripcion = params.descripcion;
        tipo.estatus = true;
        var fecha = new Date();
        var fechaMX = moment(fecha).tz("America/Mexico_City");
        tipo.timestamp = fechaMX._d;
        tipo.save((err, tipoStored) => {

            if (err || !tipoStored) {
                return res.status(404).send({});
            }
            return res.status(200).send({
                ...tipoStored._doc
            });
        });
    },
    update: (req, res) => {
        var tipoId = req.params.id;
        var params = req.body;
        try {
            !validator.isEmpty(params.estatus);
            var fecha = new Date();
            var fechaMX = moment(fecha).tz("America/Mexico_City");
            tipo.timestamp = fechaMX._d;
        } catch (err) {
            return res.status(200).send({});
        }
        TipoPago.findOneAndUpdate({
            _id: tipoId
        }, params, {
            new: true
        }, (err, tipoUpdated) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!tipoUpdated) {
                return res.status(404).send({});
            }
            return res.status(200).send({
                tipoUpdated
            });
        });
    },

    getTiposPagosA: (req, res) => {
        var query = TipoPago.find({
            "estatus": true
        });
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        query.sort('-_id').exec((err, tipos) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!tipos) {
                return res.status(404).send({});
            }
            return res.status(200).send([...tipos]);
        });
    },
    getTiposPagosI: (req, res) => {
        var query = TipoPago.find({
            "estatus": false
        });
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        query.sort('-_id').exec((err, tipos) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!tipos) {
                return res.status(404).send({});
            }
            return res.status(200).send([...tipos]);
        });
    },

    getTipoPago: (req, res) => {
        var tipoId = req.params.id;

        if (!tipoId || tipoId == null) {
            return res.status(404).send({});
        }
        TipoPago.findById(tipoId, (err, tipo) => {
            if (err || !tipoId) {
                return res.status(404).send({});
            }
            return res.status(200).send({
                tipo
            });
        });
    },

    search: (req, res) => {
        var searchString = req.params.search;
        Tipo.find({
                "$or": [{
                    "descripcion": {
                        "$regex": searchString,
                        "$options": "i"
                    }
                }]
            })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, tipos) => {
                if (err) {
                    return res.status(500).send({});
                }
                if (!tipos || tipos.length <= 0) {
                    return res.status(404).send({});
                }

                return res.status(200).send({
                    tipos
                });

            });
    }

};

module.exports = controller;