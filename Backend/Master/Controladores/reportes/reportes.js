"use strict";

const Transferencia = require("../../Modelos/transferencias/transferencias");
const Dispersion = require("../../Modelos/dispersiones/dispersiones");
const MongooseConnect = require('./../../MongooseConnect');

var controller = {
  ftEjecutadas: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const transferencia = Transferencia.find(
      {
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } }
        ],
        estatus_stp: "Ejecutada"
      },
      async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      }
    );
  },

  ftPendientes: async (req, res) => {
    var params = req.body;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;

    const transferencia = Transferencia.find(
      {
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } }
        ],
        estatus_stp: "Pendiente"
      },
      async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      }
    );
  },

  ftExitosas: async (req, res) => {
    var params = req.body;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;

    const transferencia = Transferencia.find(
      {
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } }
        ],
        estatus_stp: "Devolucion"
      },
      async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      }
    );
  },

  ftDevolucion: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const transferencia = Transferencia.find(
      {
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } }
        ],
        estatus_stp: "Exito"
      },
      async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      }
    );
  },

  ftCancelada: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const trasnferencia = Transferencia.find(
      {
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } }
        ],
        estatus_stp: "Cancelada"
      },
      async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      }
    );
  },
  fdCancelada: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const dispersion = Dispersion.find({
      $or: [
        { fechaOperacion: { $gte: fechaInicial } },
        { fechaOperacion: { $lt: fechaFinal } }
      ],
      estatus_stp: "Cancelada"
    })
      .populate("idTransferencia")
      .exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
  },

  fdEjecutadas: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const dispersion = Dispersion.find({
      $or: [
        { fechaOperacion: { $gte: fechaInicial } },
        { fechaOperacion: { $lt: fechaFinal } }
      ],
      estatus_stp: "Ejecutada",

    })
      .populate("idTransferencia")
      .exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
  },

  fdPendientes: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const dispersion = Dispersion.find({
        $or: [
           { fechaOperacion: { $gte: fechaInicial, $lt: fechaFinal }},
           { estatus_stp: "Pendiente"}
        ]
    })
      .populate("idTransferencia")
      .exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
  },

  fdExitosas: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

   const dispersion =  Dispersion.find({
      $and: [
        { fechaOperacion: { $gte: fechaInicial } },
        { fechaOperacion: { $lt: fechaFinal } }
      ],
      estatus_stp: "Devolucion"
    })
      .populate("idTransferencia")
      .exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
  },

  fdDevolucion: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const dispersion = Dispersion.find({
      $and: [
        { fechaOperacion: { $gte: fechaInicial } },
        { fechaOperacion: { $lt: fechaFinal } }
      ],
      estatus_stp: "Exito"
    })
      .populate("idTransferencia")
      .exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == "null") return res.status(500).json({});

        if (!actividad || actividad == "") return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
  }
};

module.exports = controller;
