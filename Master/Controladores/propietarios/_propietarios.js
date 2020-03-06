'use strict'

const validator = require('validator');
const Propietario = require('../../Modelos/propietarios/propietarios');
const fs = require("fs");
const crypto = require("crypto");
const axios = require('axios');
const URL_STP_REGISTRO_CUENTA = 'https://demo.stpmex.com:7024/speidemows/rest/cuentaModule/fisica';


const controller = {
    save: async(req, res) => {
        const params = req.body;
        const { propietario, cuenta } = params;
        //const registro =  this.registrarPropietarioSTP(propietario);

      /*  try {
            const validar_id_terceros = !validator.isEmpty(params.id_terceros);
            const validar_rfc = !validator.isEmpty(params.rfc);
            const validar_razon_social = !validator.isEmpty(params.razon_social);
            const validar_correo1 = !validator.isEmpty(params.correo1);
            const validar_nombre_contacto = !validator.isEmpty(params.nombre_contacto);
            const validar_telefono = !validator.isEmpty(params.telefono);
            const validar_propietario = !validator.isEmpty(params.tipo_propietario);

        } catch (err) {
            return res.status(400).send({});
            )
        }
            */
        // OBTENEMOS FECHA
        const fechaMX = new Date();
        fechaMX.setUTCHours(fechaMX.getUTCHours());

        // CREAMOS INSTANCIA DE PROPIETARIO Y SETEAMOS VALORES
        const propietario = new Propietario();
        propietario.id_terceros = params.id_terceros;
        propietario.rfc = params.rfc;
        propietario.razon_social = params.razon_social;
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


        if (params.tipo_propietario === 'personaFisica') {
            propietario.nombreCompleto = `${params.nombre} ${params.apellidoPaterno} ${params.apellidoMaterno}`;
        }
        let bandera;

        await Propietario.exists({ rfc: params.rfc }, async (err, existePropietario) => {
            if (err) return res.status(500).send({});

            if (existePropietario) return res.status(400).send('Propietario ya existente');

            await propietario.save((err, propietarioStored) => {
                if (err || !propietarioStored)
                    return res.status(400).send('No se pudo guardar el propietario');

                return res.status(200).send({ ...propietarioStored._doc });
            });
        });
    },

    getPropietario: (req, res) => {
        const propietarioId = req.params.id;
        if (!propietarioId || propietarioId == null) {}
        Propietario.findById(propietarioId, (err, propietario) => {
            if (err || !propietarioId) {
                return res.status(404).send({});
            }
            return res.status(200).send({...propietario._doc });
        });
    },

    getPropietarios: (req, res) => {
        const query = Propietario.find({ "estatus": true });

        query.sort('-_id').exec((err, propietarios) => {
            if (err) return res.status(500).send({});

            if (!propietarios) return res.status(404).send({});

            return res.status(200).send(propietarios);
        });
    },
    getPropietariosPMI: (req, res) => {
        const query = Propietario.find({ 'tipo_propietario': 'personaMoral', "estatus": false });

        query.sort('-_id').exec((err, propietarios) => {
            if (err) return res.status(500).send({});

            if (!propietarios) return res.status(404).send({});

            return res.status(200).send([...propietarios]);
        });
    },
    getPropietariosPMA: (req, res) => {
        const query = Propietario.find({ 'tipo_propietario': 'personaMoral', "estatus": true });

        query.sort('-_id').exec((err, propietarios) => {
            if (err) return res.status(500).send({});

            if (!propietarios) return res.status(404).send({});

            return res.status(200).send(propietarios);
        });
    },
    getPropietariosPFI: (req, res) => {
        const query = Propietario.find({ 'tipo_propietario': 'personaFisica', "estatus": false });

        query.sort('-_id').exec((err, propietarios) => {
            if (err) return res.status(500).send({});

            if (!propietarios) return res.status(404).send({});

            return res.status(200).send(propietarios);
        });
    },
    getPropietariosPFA: (req, res) => {
        const query = Propietario.find({ 'tipo_propietario': 'personaFisica', "estatus": true })
            .populate('paisNacimiento')
            .populate('entidadFederativa')
            .populate('actividadEconomica');

        query.sort('-_id').exec((err, propietarios) => {
            if (err) return res.status(500).send({});

            if (!propietarios) return res.status(404).send({})

            return res.status(200).send([...propietarios]);
        });
    },
    update: (req, res) => {
        const propietarioId = req.params.id;
        const params = req.body;
        try {
            !validator.isEmpty(params.estatus);
        } catch (err) {
            return res.status(200).send({});
        }
        Propietario.findOneAndUpdate({ _id: propietarioId }, params, { new: true }, (err, propietarioUpdated) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!propietarioUpdated) {}
            return res.status(200).send({ propietarioUpdated });
        });
    },

    registrarPropietarioSTP: (propietario, cuenta) => {
        const firma = this.generarFirma(propietario, cuenta);
        const response = axios.put(URL_STP_REGISTRO_CUENTA, {
            ...propietario,
            cuenta: cuenta.clabe,
            firma
        });
        return response;
    },

    generarFirma: (propietario, cuenta) => {
        let cadenaOriginal = `||${propietario.empresa}`;
        cadenaOriginal += `|cuenta.clabe|`;
        cadenaOriginal += `propietario.rfc`;

        const private_key = fs.readFileSync("certs/prueba-key.pem", "utf-8");
        const signer = crypto.createSign("sha256");
        signer.update(cadenaOriginal);
        signer.end();

        const signature = signer.sign(
          { key: private_key, passphrase: "12345678" },
          "base64"
        );

        return signature;
    }

};

module.exports = controller;