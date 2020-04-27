"use strict";
const https = require("https");

const PropietarioModel = require("../../Modelos/propietarios/propietarios");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const URL_STP_REGISTRO_CUENTA =
  "https://demo.stpmex.com:7024/speidemows/rest/cuentaModule/fisica";
const MongooseConnect = require('./../../MongooseConnect');

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
      propietario.empleado = params.empleado;
      propietario.timestamp = fechaMX;
      propietario.tipo_propietario = params.tipo_propietario;

      await this.model.exists(
        { rfc: params.rfc },
        async (err, existePropietario) => {
          if (err) return res.status(500).send({});

          if (existePropietario)
            return res.status(400).send("Propietario ya existente");

          await propietario.save(async(err, propietarioStored) => {
            const close = await mongo.close();
            if (err || !propietarioStored)
              return res.status(400).send("No se pudo guardar el propietario");

            return res.status(200).send({ ...propietarioStored._doc });
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

    const agent = new https.Agent({ rejectUnauthorized: false });
    const query = { ...propietario, firma, cuenta: cuenta.clabe };

    const response = await axios
      .put(URL_STP_REGISTRO_CUENTA, query, { httpsAgent: agent })
      .then(({ data }) => {
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

    const signature = await signer.sign(
      { key: private_key, passphrase: "12345678" },
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

    this.model.findOneAndUpdate(
      { _id: propietarioId },
      params,
      { new: true },
      async (err, propietarioUpdated) => {
        const close = await mongo.close();

        if (err) return res.status(500).send({});

        return res.status(200).send({ propietarioUpdated });
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

      return res.status(200).send({ ...propietario._doc });
    });
  }

  async getPropietarios(req, res) {

    const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
    const mongo = new MongooseConnect();
    await mongo.connect(SERVER_BD);

    const query = this.model.find({ estatus: true });

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
}

module.exports = new PropietarioController();
