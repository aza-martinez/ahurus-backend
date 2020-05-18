'use strict';

var validator = require('validator');
var Registro = require('../../Modelos/transferencias/transferencias');
var Propietario = require('../../Modelos/propietarios/propietarios');
var PropietarioController = require('../propietarios/propietarios');
var TCuentas = require('../../Modelos/tipos_cuentas/tipos_cuentas');

var controller = {
  save: (req, res) => {
    var params = req.body;
    try {
      !validator.isEmpty(params.claveRastreo);
      !validator.isEmpty(params.conceptoPago);
      !validator.isEmpty(params.cuentaBeneficiario);
      !validator.isEmpty(params.cuentaOrdenante);
      !validator.isEmpty(params.emailBeneficiario);
      !validator.isEmpty(params.Empresa);
      !validator.isEmpty(params.fechaOperacion);
      !validator.isEmpty(params.firma);
      !validator.isEmpty(params.folioOrigen);
      !validator.isEmpty(params.institucionContraparte);
      !validator.isEmpty(params.institucionOperante);
      !validator.isEmpty(params.monto);
      !validator.isEmpty(params.nombreBeneficiario);
      !validator.isEmpty(params.nombreOrdenante);
      !validator.isEmpty(params.referenciaNumerica);
      !validator.isEmpty(params.rfcCurpBeneficiario);
      !validator.isEmpty(params.tipoCuentaBeneficiario);
      !validator.isEmpty(params.tipoCuentaOrdenante);
      !validator.isEmpty(params.tipoPago);
      !validator.isEmpty(params.propietario);
      !validator.isEmpty(params.cuenta);
    } catch (err) {
      return res.status(400).send({});
    }
    var registro = new Registro();
    registro.claveRastreo = params.claveRastreo;
    registro.conceptoPago = params.conceptoPago;
    registro.cuentaBeneficiario = params.cuentaBeneficiario;
    registro.cuentaOrdenante = params.cuentaOrdenante;
    registro.emailBeneficiario = params.emailBeneficiario;
    registro.Empresa = params.Empresa;
    registro.fechaOperacion = params.fechaOperacion;
    registro.firma = params.firma;
    registro.folioOrigen = params.folioOrigen;
    registro.institucionContraparte = params.institucionContraparte;
    registro.institucionOperante = params.institucionOperante;
    registro.monto = params.monto;
    registro.nombreBeneficiario = params.nombreBeneficiario;
    registro.nombreOrdenante = params.nombreOrdenante;
    registro.referenciaNumerica = params.referenciaNumerica;
    registro.rfcCurpBeneficiario = params.rfcCurpBeneficiario;
    registro.tipoCuentaBeneficiario = params.tipoCuentaBeneficiario;
    registro.tipoCuentaOrdenante = params.tipoCuentaOrdenante;
    registro.tipoPago = params.tipoPago;
    registro.propietario = params.propietario;
    registro.cuenta = params.cuenta;
    registro.save((err, registroStored) => {
      if (err || !registroStored) {
        return res.status(404).send({});
      }
      return res.status(200).send({ ...registroStored._doc });
    });
  },

  getFirma(key, dateStamp, regionName, serviceName) {
    var crypto = require('crypto-js');
    var kDate = crypto.HmacSHA256(dateStamp, 'AWS4' + key);
    var kRegion = crypto.HmacSHA256(regionName, kDate);
    var kService = crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = crypto.HmacSHA256('aws4_request', kService);
    return kSigning;
  },

  getRegistro: (req, res) => {
    var searchString = req.params.search;
    Registro.find({ rfcCurpBeneficiario: searchString })
      .populate('propietario')
      .populate('cuenta')
      .exec((err, registros) => {
        if (err) {
          return res.status(500).send({});
        }
        if (!registros || registros.length <= 0) {
          return res.status(404).send({});
        }

        return res.status(200).send(registros);
      });
  },

  getRegistros: (req, res) => {
    var searchString = req.params.search;
    Registro.find({})
      .populate('propietario')
      .populate('cuenta')
      .sort([['date', 'descending']])
      .exec((err, registros) => {
        if (err) {
          return res.status(500).send({});
        }
        if (!registros || registros.length <= 0) {
          return res.status(404).send({});
        }
        return res.status(200).send(registros);
      });
  },
};
module.exports = controller;
