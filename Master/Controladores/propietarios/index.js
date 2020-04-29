"use strict";

const https = require("https");
var request = require("request");
const PropietarioModel = require("../../Modelos/propietarios/propietarios");
const fs = require("fs");
const Cuenta = require("../../Modelos/cuentas/cuentas");
var azure = require("azure-storage");
var XLSX = require("xlsx");
const moment = require("moment");
const Counter = require('../../Modelos/counters/counters');
var crypto = require("crypto");
const axios = require("axios");
const URL_STP_REGISTRO_CUENTA =
  "https://demo.stpmex.com:7024/speidemows/rest/cuentaModule/fisica";
const MongooseConnect = require('./../../MongooseConnect');
const KEY_STORAGE =
  "ytq2QZ6b5mqLZxj8BD5Js2ZEHCMpZSVSCYjGXniHE8/YO1jPakmL+RMMwG/nLXxh1lrKcES74na5NCR3hE+K6g==";
const STORAGE_ACCOUNT = "smahurus";
const STORAGE_CONTAINER = "propietarios";

class PropietarioController {
  constructor() {
    this.model = PropietarioModel;
  }

  async crearPropietario(req, res) {
    try {
      const params = req.body;

      const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
      const mongo = new MongooseConnect();
      await mongo.connect(SERVER_BD);

      // OBTENEMOS FECHA
      const fechaMX = new Date();
      fechaMX.setUTCHours(fechaMX.getUTCHours());

      // CREAMOS INSTANCIA DE PROPIETARIO Y SETEAMOS VALORES
      const propietario = new this.model();
      propietario.id_terceros = params.id_terceros;
      propietario.rfc = params.rfc;
      propietario.razon_social =
        params.razon_social ||
        `${params.nombre} ${params.apellidoPaterno} ${params.apellidoMaterno}`;
      propietario.correo1 = params.correo1;
      propietario.correo2 = params.correo2;
      propietario.genero = params.genero;
      propietario.fechaNacimiento = params.fechaNacimiento;
      propietario.paisNacimiento = params.paisNacimiento;
      propietario.actividadEconomica = params.actividadEconomica;
      propietario.apellidoPaterno = params.apellidoPaterno;
      propietario.apellidoMaterno = params.apellidoMaterno;
      propietario.nombre = params.nombre;
      propietario.entidadFederativa = params.entidadFederativa;
      propietario.municipio = params.municipio;
      propietario.colonia = params.colonia;
      propietario.calle = params.calle;
      propietario.numExterior = params.numExterior;
      propietario.numInterior = params.numInterior;
      propietario.codigoPostal = params.codigoPostal;
      propietario.nombre_contacto = params.nombre_contacto;
      propietario.telefono = params.telefono;
      propietario.estatus = true;
      propietario.empresa = params.empresa;
      propietario.timestamp = fechaMX;
      propietario.tipo_propietario = params.tipo_propietario;

      await this.model.exists({
          rfc: params.rfc
        },
        async (err, existePropietario) => {
          if (err) return res.status(500).send({});

          if (existePropietario)
            return res.status(400).send("Propietario ya existente");

          await propietario.save(async (err, propietarioStored) => {
            const close = await mongo.close();
            if (err || !propietarioStored)
              return res.status(400).send("No se pudo guardar el propietario");

            return res.status(200).send({
              ...propietarioStored._doc
            });
          });
        }
      );
    } catch (error) {
      const close = await mongo.close();
      return res.send(500).send('No se pudo completar la operación');
    }
  }

  async registrarPropietarioSTP(propietario, cuenta) {
    const firma = await this.generarFirma(propietario, cuenta);

    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    const query = {
      ...propietario,
      firma,
      cuenta: cuenta.clabe
    };

    const response = await axios
      .put(URL_STP_REGISTRO_CUENTA, query, {
        httpsAgent: agent
      })
      .then(({
        data
      }) => {
        console.log("==== data registrar propietario");
        console.log(data);
      })
      .catch(e => {
        console.log("=== ERROR CATCH AXIOS ====");
        console.log(e);
      });
    return response;
  }

  async generarFirma(propietario, cuenta) {
    let cadenaOriginal = `||${propietario.empresa}`;
    cadenaOriginal += `|${cuenta.clabe}|`;
    cadenaOriginal += `${propietario.rfcCurp}||`;

    const private_key = await fs.readFileSync(
      "certs/RPF/prueba-key.pem",
      "utf-8"
    );
    const signer = await crypto.createSign("sha256");
    await signer.update(cadenaOriginal);
    await signer.end();

    const signature = await signer.sign({
        key: private_key,
        passphrase: "12345678"
      },
      "base64"
    );

    return signature;
  }

  async update(req, res) {
    const propietarioId = req.params.id;
    const params = req.body;

    try {
      !validator.isEmpty(params.estatus);
    } catch (err) {
      return res.status(200).send({});
    }

    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    this.model.findOneAndUpdate({
        _id: propietarioId
      },
      params, {
        new: true
      },
      async (err, propietarioUpdated) => {
        const close = await mongo.close();

        if (err) return res.status(500).send({});

        return res.status(200).send({
          propietarioUpdated
        });
      }
    );
  }

  async getPropietariosPFA(req, res) {
    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const query = this.model
      .find({
        tipo_propietario: "personaFisica",
        estatus: true
      })
      .populate("paisNacimiento")
      .populate("entidadFederativa")
      .populate("actividadEconomica");

    query.sort("-_id").exec(async (err, propietarios) => {
      console.log(propietarios);
      const close = await mongo.close();

      if (err) return res.status(500).send({});

      if (!propietarios) return res.status(404).send({});

      return res.status(200).send(propietarios);
    });
  }

  async getPropietario(req, res) {
    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const propietarioId = req.params.id;

    this.model.findById(propietarioId, async (err, propietario) => {
      const close = await mongo.close();

      if (err || !propietarioId) return res.status(404).send({});

      return res.status(200).send({
        ...propietario._doc
      });
    });
  }

  async getPropietarios(req, res) {

    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const query = this.model.find({
      estatus: true
    });

    const propietarios = query.sort("_id").exec(async (err, propietarios) => {
      console.log('PROPIETARIOS', propietarios);
      const close = await mongo.close();

      if (err) return res.status(500).send({});

      if (!propietarios) return res.status(404).send({});

      return res.status(200).send(propietarios);
    });
  }

  async getPropietariosPMI(req, res) {
    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const query = this.model.find({
      tipo_propietario: "personaMoral",
      estatus: false
    });

    query.sort("-_id").exec(async (err, propietarios) => {
      const close = await mongo.close();

      if (err) return res.status(500).send({});

      if (!propietarios) return res.status(404).send({});

      return res.status(200).send([...propietarios]);
    });
  }
  async getPropietariosPMA(req, res) {

    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const query = this.model.find({
      tipo_propietario: "personaMoral",
      estatus: true
    });

    query.sort("-_id").exec(async (err, propietarios) => {
      const close = await mongo.close();

      if (err) return res.status(500).send({});

      if (!propietarios) return res.status(404).send({});

      return res.status(200).send(propietarios);
    });
  }

  async getPropietariosPFI(req, res) {
    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const query = this.model.find({
      tipo_propietario: "personaFisica",
      estatus: false
    });

    query.sort("-_id").exec(async (err, propietarios) => {
      const close = await mongo.close();

      if (err) return res.status(500).send({});

      if (!propietarios) return res.status(404).send({});

      return res.status(200).send(propietarios);
    });
  }

  async saveFile(req, res) {
    var file_name = "Documento no subido..";
    const user = req.user['http://localhost:3000/user_metadata'].user;
    var params = req.body;
    if (!req.files) {
      console.log(req.files);
      return res.status(404).send({});
    }
    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const folio = await Counter.findByIdAndUpdate({
      _id: 'propietarios'
    }, {
      $inc: {
        invoice: 1
      }
    })
    var file_path = req.files.file.path;
    var file_name = folio.invoice + '_' + req.files.file.originalFilename;
    var extension_split = file_name.split(".");
    var file_ext = extension_split[1];
    const blobService = azure.createBlobService(STORAGE_ACCOUNT, KEY_STORAGE);
    let fileStorage = null;
    const startDate = new Date();
    const expiryDate = new Date(startDate);

    const sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        start: startDate,
        Expiry: azure.date.minutesFromNow(20)
      }
    };
    await blobService.createBlockBlobFromLocalFile(
      STORAGE_CONTAINER,
      file_name,
      file_path,
      async (e, result, req) => {
        if (e) {
          return;
        }

        const token = await blobService.generateSharedAccessSignature(
          STORAGE_CONTAINER,
          result.name,
          sharedAccessPolicy
        );
        const fileURLStorage = await blobService.getUrl(
          STORAGE_CONTAINER,
          result.name,
          token,
          true
        );

        request(fileURLStorage, {
          encoding: null
        }, async (error, response, body) => {
          var workbook = XLSX.read(body, {
            type: "buffer"
          });

          const referencia = workbook.Sheets["Hoja1"]["!ref"];
          const primeraFila = referencia.split(":")[0].substr(1);
          const ultimaFila = referencia.split(":")[1].substr(1);

          delete workbook.Sheets["Hoja1"]["!ref"];
          delete workbook.Sheets["Hoja1"]["!margins"];
          const FILAS = workbook.Sheets["Hoja1"];

          // const jsonToArray

          let jsonToArray = [];
          let registro = {};

          var fecha = new Date();
          var fechaOperacion = moment(fechaMX).format("YYYYMMDD");
          var fechaMX = moment(fecha).tz("America/Mexico_City");

          Object.keys(FILAS).map(async (fila, index) => {
            if (fila.substr(1) === "1") {
              delete FILAS[fila];
              return;
            }

            switch (fila.substr(0, 1)) {
              case "A":
                registro["razon_social"] = FILAS[fila]["w"];
                break;
              case "B":
                registro["rfc"] = FILAS[fila]["w"];
                break;
              case "C":
                registro["nombre"] = FILAS[fila]["w"];
                break;
              case "D":
                registro["apellidoPaterno"] = FILAS[fila]["w"];
                break;
              case "E":
                registro["apellidoMaterno"] = FILAS[fila]["w"];
                break;
              case "F":
                registro["id_terceros"] = FILAS[fila]["w"];
                break;
              case "G":
                registro["correo1"] = FILAS[fila]["w"];
                break;
              case "H":
                registro["genero"] = FILAS[fila]["w"];
                break;
              case "I":
                registro["fechaNacimiento"] = FILAS[fila]["w"];
                break;
              case "J":
                registro["nombre_contacto"] = FILAS[fila]["w"];
                break;
              case "K":
                registro["telefono"] = FILAS[fila]["w"];
                break;
              case "L":
                registro["tipo_propietario"] = FILAS[fila]["w"];
                break;
              case "M":
                registro["actividadEconomica"] = FILAS[fila]["w"];
                break;
              case "N":
                registro["paisNacimiento"] = FILAS[fila]["w"];
                break;
              case "O":
                registro["entidadFederativa"] = FILAS[fila]["w"];
                break;
              case "P":
                registro["municipio"] = FILAS[fila]["w"];
                break;
              case "Q":
                registro["codigoPostal"] = FILAS[fila]["w"];
                break;
              case "R":
                registro["colonia"] = FILAS[fila]["w"];
                break;
              case "S":
                registro["calle"] = FILAS[fila]["w"];
                break;
              case "T":
                registro["numInterior"] = FILAS[fila]["w"];
                break;
              case "U":
                registro["numExterior"] = FILAS[fila]["w"];
                break;
              case "V":
                registro["tipoCuenta"] = FILAS[fila]["w"];
                break;
              case "W":
                registro["descripcion"] = FILAS[fila]["w"];
                break;
              case "X":
                registro["tarjeta_clabe"] = FILAS[fila]["w"];
                break;
              case "Y":
                registro["banco"] = FILAS[fila]["w"];
                break;
              case "Z":
                registro["tipo_registro"] = FILAS[fila]["w"];

                var propietario = new PropietarioModel();
                propietario.id_terceros = registro["id_terceros"];
                propietario.nombre = registro["nombre"].trim();
                propietario.apellidoPaterno = registro["apellidoPaterno"].trim();
                propietario.apellidoMaterno = registro["apellidoMaterno"].trim();
                propietario.timestamp = fechaMX._d;
                propietario.estatus = true;
                propietario.nombreCompleto = `${propietario.nombre}${propietario.apellidoPaterno}${propietario.apellidoMaterno}`;
                propietario.rfc = registro["rfc"].trim();
                propietario.razon_social = registro["razon_social"].trim();
                propietario.correo1 = registro["correo1"].trim();
                propietario.genero = registro["genero"].trim();
                propietario.fechaNacimiento = registro["fechaNacimiento"].trim();
                propietario.nombre_contacto = registro["nombre_contacto"].trim();
                propietario.telefono = registro["telefono"].trim();
                propietario.tipo_propietario = registro["tipo_propietario"].trim();
                propietario.paisNacimiento = registro["paisNacimiento"].trim();
                propietario.actividadEconomica = registro["actividadEconomica"].trim();
                propietario.entidadFederativa = registro["entidadFederativa"].trim();
                propietario.municipio = registro["municipio"].trim();
                propietario.codigoPostal = registro["codigoPostal"];
                propietario.colonia = registro["colonia"].trim();
                propietario.calle = registro["calle"].trim();
                propietario.numInterior = registro["numInterior"];
                propietario.numExterior = registro["numExterior"];

                var cuenta = new Cuenta();
                //DATOS DE LA CUENTA
                cuenta.tipo_cuenta = registro["tipoCuenta"]; //id
                cuenta.descripcion = registro["descripcion"];
                cuenta.timestamp = fechaMX._d;
                cuenta.estatus = true;
                cuenta.clabe = registro["tarjeta_clabe"];
                cuenta.tipo_registro = registro["tipo_registro"];
                cuenta.institucion = registro["banco"]; //id

                //propietario.cuenta = cuenta._id;
                //cuenta.propietario.push(propietario._id);
                await propietario.save((err, propietarioStored) => {
                  if (err || !propietarioStored) {
                    console.log(err);
                  }
                  // console.log(propietarioStored);
                });

                await cuenta.save((err, cuentaStored) => {
                  if (err || !cuentaStored) {
                    console.log(err);
                  }
                  //console.log(cuentaStored);
                });
                break;
              default:
                break;

            }
          });
          return res.status(200).send({});
        });

        return;
      }

    );
    const close = await mongo.close();
  }





}

module.exports = new PropietarioController();