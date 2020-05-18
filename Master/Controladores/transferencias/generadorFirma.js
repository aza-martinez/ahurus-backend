'use strict';
var validator = require('validator');
var Transferencia = require('../../Modelos/transferencias/transferencias');
const moment = require('moment');
const fs = require('fs');
var crypto = require('crypto');
const axios = require('axios');
var controller = {
  generar: (req, res) => {
    cadenaOriginal =
      '||40014|DUPDRIN|||DUPDRIN179|90646|2039.22|1|||||40|CARREON MARTINEZ JOSE ALEJANDRO|014116566996466295|ND|0|||||CARREON MARTINEZ JOSE ALEJANDRO||||||81119||T||3||0.00||';
    const private_key = fs.readFileSync('certs/prueba-key.pem', 'utf-8');
    const signer = crypto.createSign('sha256');
    signer.update(cadenaOriginal);
    signer.end();
    const signature = signer.sign(
      { key: private_key, passphrase: '12345678' },
      'base64'
    );
    params.firma = signature;
    const firma = signature;
  },
};
module.exports = controller;
