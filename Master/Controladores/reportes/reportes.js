"use strict";

const Transferencia = require("../../Modelos/transferencias/transferencias");
const Dispersion = require("../../Modelos/dispersiones/dispersiones");
const MongooseConnect = require("./../../MongooseConnect");
const moment = require("moment");
const momentz = require("moment-timezone");
const Counter = require("../../Modelos/counters/counters");
const fs = require("fs");
var path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const https = require("https");
var envJSON = require("../../../env.variables.json");
var node_env = process.env.NODE_ENV || "development";
const DateGenerator = require('./../../helpers/DateGenerator');

if (node_env == "production") {
  var certificado = envJSON[node_env].CERTS_URL_P;
  var passphrase = envJSON[node_env].PASSPHRASE_CERT_P;
  var endpoint_stp = envJSON[node_env].ENDPOINT_STP_P;
  var endpoint_stp_track = envJSON[node_env].ENDPOINT_STP_TRACK_P;
  var endpoint_stp_balance = envJSON[node_env].ENDPOINT_STP_BALANCE_P;
} else {
  var certificado = envJSON[node_env].CERTS_URL_D;
  var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
  var endpoint_stp = envJSON[node_env].ENDPOINT_STP_D;
  var endpoint_stp_track = envJSON[node_env].ENDPOINT_STP_TRACK_D;
  var endpoint_stp_balance = envJSON[node_env].ENDPOINT_STP_BALANCE_D;
}

var controller = {
  getReportTransfer: async (req, res) => {
    // Conexión a la BD
    //const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect("sefince");

    try {
      const params = req.body;
      const { fechaInicial, fechaFinal, estatus, empresa } = params;
  
      let query = { estatus_stp: estatus, medio: "Transferencia" };
      
      if(estatus && estatus !== 'ALL') query.estatus_stp = estatus;
      if(empresa) query.empresa = empresa;
      if(fechaInicial) query.fechaOperacion = { $gte: fechaInicial};
      if(fechaFinal) query.fechaOperacion = { $lte: fechaFinal};

      const transferencias = await Transferencia.find(query);
      
      if(!transferencias) return res.status(400);

      await mongo.close();
      return res.send(transferencias);
    } catch (error) {
      await mongo.close();
      console.log(error);
      return res.status(500).send('Error interno');
    }
  },
  getBalance: async (req, res) => {
    var params = req.body;
    const SERVER_BD = 'SEFINCE'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const cuentaOrdenante = params.cuentaOrdenante; // ejemplo: '20190326'
    let cadenaOriginal = cuentaOrdenante;
    const private_key = fs.readFileSync(certificado, 'utf-8');
    console.log(cadenaOriginal);
    const signer = crypto.createSign("sha256");
    signer.update(cadenaOriginal);
    signer.end();
    const signature = signer.sign(
      {
        key: private_key,
        passphrase: passphrase,
      },
      "base64"
    );
    console.log(signature);
    var consultaSaldoCuenta = {
      cuentaOrdenante: cuentaOrdenante,
      firma: signature,
    };

    //const agent = (https.globalAgent.options.rejectUnauthorized = false);
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    await axios
      .post(endpoint_stp_balance, consultaSaldoCuenta, {
        httpsAgent: agent,
      })
      .then((response) => {
        if (response) {
          return res.status(200).send(response.data.resultado);
        }

        if (!response) {
          return res.status(200).send(response.data.resultado);
        }
      })
      .catch(async (error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  },

  getReportDisper: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const tipo = params.tipo;
    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    let filter = params.filter;
    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    console.log(filter);

    if (
      filter === "ALL" &&
      fechaInicial != undefined &&
      fechaFinal != undefined
    ) {
      Dispersion.find({
        estatus_stp: tipo,
        fechaOperacion: { $gte: fechaInicial },
        fechaOperacion: { $lte: fechaFinal },
      })
        .populate("idTransferencia")
        .exec(async (err, actividad) => {
          const close = await mongo.close();
          if (err || err == "null") return res.status(500).json({});
          if (!actividad || actividad == "") return res.status(400).json({});
          if (actividad) return res.status(200).json(actividad);
        });
    } else if (fechaInicial != undefined && fechaFinal != undefined) {
      Dispersion.find({
        estatus_stp: tipo,
        fechaOperacion: { $gte: fechaInicial },
        fechaOperacion: { $lte: fechaFinal },
        empresa: filter,
      })
        .populate("idTransferencia")
        .exec(async (err, actividad) => {
          const close = await mongo.close();
          if (err || err == "null") return res.status(500).json({});
          if (!actividad || actividad == "") return res.status(400).json({});
          if (actividad) return res.status(200).json(actividad);
        });
    } else
      Dispersion.find({
        estatus_stp: tipo,
      })
        .populate("idTransferencia")
        .exec(async (err, actividad) => {
          const close = await mongo.close();
          if (err || err == "null") return res.status(500).json({});
          if (!actividad || actividad == "") return res.status(400).json({});
          if (actividad) return res.status(200).json(actividad);
        });
  },
};

module.exports = controller;
