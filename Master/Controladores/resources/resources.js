'use strict';

var Institucion = require('../../Modelos/instituciones/instituciones');
var TipoPago = require('../../Modelos/tipos_pagos/tipos');
const MongooseConnect = require('../../MongooseConnect');

var controller = {
  getBancos: async (req, res) => {
    var query = Institucion.find({});
    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }

    const SERVER_BD = 'resources';
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    query.sort('-_id').exec(async (err, instituciones) => {
      const close = await mongo.close();

      if (err) return res.status(500).send({});

      return res.status(200).send([...instituciones]);
    });
  },
  getTipos: async (req, res) => {
    var query = TipoPago.find({});
    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }

    const SERVER_BD = 'resources';
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    query.sort('-_id').exec(async (err, tipos) => {
      const close = await mongo.close();

      if (err) return res.status(500).send({});

      return res.status(200).send([...tipos]);
    });
  },
};

module.exports = controller;
