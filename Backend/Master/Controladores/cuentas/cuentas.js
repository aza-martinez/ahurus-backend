"use strict";

const validator = require("validator");
const Propietario = require("../../Modelos/propietarios/propietarios");
const Cuenta = require("../../Modelos/cuentas/cuentas");
const MongooseConnect = require("./../../MongooseConnect");

const controller = {
  delete: (req, res) => {
    var cuentaId = req.params.id;
    Cuenta.findOneAndDelete({ _id: cuentaId }, (err, cuentaRemoved) => {
      if (err) {
        return res.status(500).send({});
      }

      if (!cuentaRemoved) {
        return res.status(404).send({});
      }
      return res.status(200).send({ cuentaRemoved });
    });
  },

  update: async (req, res) => {
    var cuentaID = req.params.id;

    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    try {
      var params = req.body;
      !validator.isEmpty(params.tipo_cuenta);
      !validator.isEmpty(params.descripcion);
      !validator.isEmpty(params.clabe);
      !validator.isEmpty(params.tipo_registro);
      !validator.isEmpty(params.propietario);
      !validator.isEmpty(params.estatus);
      !validator.isEmpty(params.institucion);
    } catch (err) {}

    Cuenta.findOneAndUpdate(
      { _id: cuentaID },
      params,
      { new: true },
      async (err, cuentaUpdated) => {
        const close = await mongo.close();

        if (err) return res.status(500).send({});

        if (!cuentaUpdated) return res.status(404).send({});

        return res.status(200).send({ cuentaUpdated });
      }
    );
  },

  save: async (req, res) => {
    try {
      const SERVER_BD = req.empresa;
      const mongo = new MongooseConnect();
      await mongo.connect(SERVER_BD);

      const params = req.body;
      const cuenta = new Cuenta();
      cuenta.tipo_cuenta = params.tipo_cuenta;
      cuenta.descripcion = params.descripcion;
      cuenta.clabe = params.clabe;
      cuenta.tipo_registro = params.tipo_registro;
      cuenta.propietario = params.propietario;
      cuenta.estatus = true;
      cuenta.institucion = params.institucion;
      const fechaMX = new Date();

      fechaMX.setUTCHours(fechaMX.getUTCHours());
      cuenta.timestamp = fechaMX;

      cuenta.save((err, cuentaStored) => {
        if (err || !cuentaStored) return res.status(404).send({ err });

        const queryUpdate = { $push: { cuentas: cuentaStored._id } };

        Propietario.findByIdAndUpdate(
          params.propietario,
          queryUpdate,
          async (err, propietario) => {
            const close = await mongo.close();
            return res.status(200).send({ cuentaStored, propietario });
          }
        );
      });
    } catch (error) {
      const close = await mongo.close();
      return res.status(500).send();
    }
  },

  getCuentasPA: async (req, res) => {
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const cuentas = Cuenta.find({
      tipo_registro: "personaMoral",
      estatus: true
    })
      .populate("propietario")
      .populate("tipo_cuenta")
      .populate("institucion")
      .sort([["date", "descending"]])
      .exec(async (err, registros) => {
        const close = await mongo.close();

        if (err) return res.status(500).send({});

        return res.status(200).send(registros);
      });
  },

  getCuentasCA: async (req, res) => {
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const cuentas = Cuenta.find({
      tipo_registro: "personaFisica",
      estatus: true
    })
      .populate({ path: "propietario", select: "razon_social" })
      .populate("tipo_cuenta")
      .populate("institucion")
      .sort([["date", "descending"]])
      .exec(async (err, registros) => {
        const close = await mongo.close();

        if (err) return res.status(500).send({});

        return res.status(200).send(registros);
      });
  },
  getPropietariosA: async (req, res) => {
    var searchString = req.params.search;
    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const cuentas = Cuenta.find({ estatus: true })
      .populate("propietario")
      .populate("tipo_cuenta")
      .populate("institucion")
      .sort([["date", "descending"]])
      .exec(async (err, registros) => {
        if (err) return res.status(500).send({});

        const close = await mongo.close();
        return res.status(200).send(registros);
      });
  },
  getCuentasPropietarios: (req, res) => {
    var searchString = req.params.search;
    Cuenta.find({ propietario: searchString, estatus: true })
      .populate("institucion")
      .populate("tipo_cuenta")
      .populate("institucion")
      .sort([["date", -1]])
      .exec((err, registros) => {
        if (err) {
          console.log(err);
          return res.status(500).send({});
        }
        if (!registros || registros.length <= 0) {
        }
        return res.status(200).send(registros);
      });
  },
  getCuentas: (req, res) => {
    var searchString = req.params.search;
    Cuenta.find({ estatus: true })
      .populate("propietario")
      .populate("tipo_cuenta")
      .populate("institucion")
      .sort([["date", "descending"]])
      .exec((err, registros) => {
        if (err) {
          return res.status(500).send({});
        }
        if (!registros || registros.length <= 0) {
        }
        return res.status(200).send(registros);
      });
  },
  hide: async (req, res) => {
    var cuentaID = req.params.id;
    var params = req.body;

    try {
      !validator.isEmpty(params.estatus);
    } catch (err) {
      return res.status(200).send({});
    }

    const SERVER_BD = req.empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    Cuenta.findOneAndUpdate(
      { _id: cuentaID },
      params,
      { new: true },
      async (err, cuentaHide) => {
        const close = await mongo.close();

        if (err) return res.status(500).send({});

        return res.status(200).send({ cuentaHide });
      }
    );
  },
  getPropietario: (req, res) => {
    var searchString = req.params.search;
    Propietario.find({ razon_social: searchString })
      .sort([["date", "descending"]])
      .exec((err, propietarios) => {
        if (err) {
          return res.status(500).send({});
        }
        if (!propietarios || propietarios.length <= 0) {
        }
        return res.status(200).send(propietarios);
      });
  },
  getLeerExcel: (req, res) => {
    var xls = require("excel");

    xls("Sheet.xlsx", function(err, data) {
      if (err) throw err;
      // data is an array of arrays
    });
    function convertToJSON(array) {
      var first = array[0].join();
      var headers = first.split(",");

      var jsonData = [];
      for (var i = 1, length = array.length; i < length; i++) {
        var myRow = array[i].join();
        var row = myRow.split(",");

        var data = {};
        for (var x = 0; x < row.length; x++) {
          data[headers[x]] = row[x];
        }
        jsonData.push(data);
      }
      return jsonData;
    }

    xlsx("tasks.xlsx", function(err, data) {
      if (err) throw err;
      //console.log(jsonDataArray(data));
      console.log(JSON.stringify(convertToJSON(data)));
      //console.log(data);
    });
  }
};
module.exports = controller;
