'use strict';

const Transferencia = require('../../Modelos/transferencias/transferencias');
const Dispersion = require('../../Modelos/dispersiones/dispersiones');
const MongooseConnect = require('./../../MongooseConnect');
const moment = require('moment');
const momentz = require('moment-timezone');
const Counter = require('../../Modelos/counters/counters');
const fs = require('fs');
var path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const https = require('https');
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';

if (node_env == 'production') {
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
  ftEjecutadas: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Transferencia.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Ejecutada',
        medio: 'Transferencia',
      });
    } else {
      queryExec = Transferencia.find({
        estatus_stp: 'Ejecutada',
        medio: 'Transferencia',
      });

      queryExec.exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },

  ftPendientes: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Transferencia.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Pendiente',
        medio: 'Transferencia',
      });
    } else {
      queryExec = Transferencia.find({
        estatus_stp: 'Pendiente',
        medio: 'Transferencia',
      });

      queryExec.exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },

  ftExitosas: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Transferencia.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Exito',
        medio: 'Transferencia',
      });
    } else {
      queryExec = Transferencia.find({
        estatus_stp: 'Exito',
        medio: 'Transferencia',
      });

      queryExec.exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },

  ftDevolucion: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Transferencia.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Error',
        medio: 'Transferencia',
      });
    } else {
      queryExec = Transferencia.find({
        estatus_stp: 'Error',
        medio: 'Transferencia',
      });

      queryExec.exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },

  getTrack: async (req, res) => {
    var params = req.body;
    const SERVER_BD = 'SEFINCE'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const fechaOperacion = params.fechaOperacion.replace(/["']/g, ''); // ejemplo: '20190326'
    const claveRastreo = params.claveRastreo;
    const empresa = 'SEFINCE';
    const institucionOperante = params.institucionOperante.replace(/["']/g, '');

    let cadenaOriginal = `||${''}|`;
    cadenaOriginal += `${empresa}|`;
    cadenaOriginal += `${fechaOperacion}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${claveRastreo}|`;
    cadenaOriginal += `${institucionOperante}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}||`;
    const private_key = fs.readFileSync(certificado, 'utf-8');
    console.log(cadenaOriginal);
    const signer = crypto.createSign('sha256');
    signer.update(cadenaOriginal);
    signer.end();
    const signature = signer.sign(
      {
        key: private_key,
        passphrase: passphrase,
      },
      'base64'
    );
    let track = {
      claveRastreo: claveRastreo,
      fechaOperacion: fechaOperacion,
      institucionOperante: institucionOperante,
      empresa: empresa,
      firma: signature,
    };
    console.log(track);
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    await axios
      .post(endpoint_stp_track, track, {
        httpsAgent: agent,
      })
      .then((response) => {
        if (response) {
          console.log(response.data.resultado.descripcionError);
          return res.status(200).send(response.data.resultado.descripcionError);
        }

        if (!response) {
          // console.log(response);
          return res.status(200).send(response.data.resultado.descripcionError);
        }
      })
      .catch(async (error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  },

  getBalance: async (req, res) => {
    var params = req.body;
    const SERVER_BD = 'SEFINCE'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const cuentaOrdenante = 646180182300000009; // ejemplo: '20190326'
    let cadenaOriginal = `||${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${cuentaOrdenante}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}|`;
    cadenaOriginal += `${''}||`;
    const private_key = fs.readFileSync(certificado, 'utf-8');
    console.log(cadenaOriginal);
    const signer = crypto.createSign('sha256');
    signer.update(cadenaOriginal);
    signer.end();
    const signature = signer.sign(
      {
        key: private_key,
        passphrase: passphrase,
      },
      'base64'
    );
    var consultaSaldoCuenta = {
      cuentaOrdenante: cuentaOrdenante,
      firma: signature,
    };

    //const agent = (https.globalAgent.options.rejectUnauthorized = false);
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    await axios
      .post(
        'https://prod.stpmex.com/speiws/rest/ordenPago/consSaldoCuenta ',
        consultaSaldoCuenta,
        {
          httpsAgent: agent,
        }
      )
      .then((response) => {
        console.log(response);
        if (response) {
          console.log(response);
          return res.status(200).send(response);
        }

        if (!response) {
          // console.log(response);
          return res.status(200).send(response);
        }
      })
      .catch(async (error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  },

  fdEjecutadas: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Dispersion.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Ejecutada',
      });
    } else {
      queryExec = Dispersion.find({
        estatus_stp: 'Ejecutada',
      });

      queryExec.populate('idTransferencia').exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },

  fdPendientes: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Dispersion.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Pendiente',
      });
    } else {
      queryExec = Dispersion.find({
        estatus_stp: 'Pendiente',
      });

      queryExec.populate('idTransferencia').exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },

  fdExitosas: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Dispersion.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Exito',
      });
    } else {
      queryExec = Dispersion.find({
        estatus_stp: 'Exito',
      });

      queryExec.populate('idTransferencia').exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },

  fdDevolucion: async (req, res) => {
    var params = req.body;
    const fechaInicial = params.fechaInicial; // ejemplo: '2019/03/26'
    const fechaFinal = params.fechaFinal;
    const SERVER_BD = 'sefince'; //req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();

    await mongo.connect(SERVER_BD);

    console.log(fechaInicial);
    console.log(fechaFinal);
    let queryExec = '';
    if (fechaInicial != undefined && fechaFinal != undefined) {
      queryExec = Dispersion.find({
        $or: [
          { fechaOperacion: { $gte: fechaInicial } },
          { fechaOperacion: { $lt: fechaFinal } },
        ],
        estatus_stp: 'Error',
      });
    } else {
      queryExec = Dispersion.find({
        estatus_stp: 'Error',
      });

      queryExec.populate('idTransferencia').exec(async (err, actividad) => {
        const close = await mongo.close();

        if (err || err == 'null') return res.status(500).json({});

        if (!actividad || actividad == '') return res.status(400).json({});

        if (actividad) return res.status(200).json(actividad);
      });
    }
  },
};

module.exports = controller;
