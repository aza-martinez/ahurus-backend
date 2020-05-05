"use strict";
const https = require("https");
const Transferencia = require("../../Modelos/transferencias/transferencias");
const moment = require("moment");
const momentz = require("moment-timezone");
const Counter = require('../../Modelos/counters/counters');
const fs = require("fs");
var path = require("path");
const crypto = require("crypto");
const axios = require("axios");
var envJSON = require('../../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';

if (node_env == "production") {
    var certificado = envJSON[node_env].CERTS_URL_P;
    var passphrase = envJSON[node_env].PASSPHRASE_CERT_P;
    var endpoint_stp = envJSON[node_env].ENDPOINT_STP_P;
} else {
    var certificado = envJSON[node_env].CERTS_URL_D;
    var passphrase = envJSON[node_env].PASSPHRASE_CERT_D;
    var endpoint_stp = envJSON[node_env].ENDPOINT_STP_D;
}

const Mailer = require("./../../mailer");
const MongooseConnect = require("./../../MongooseConnect");
const {
    SSL_OP_CRYPTOPRO_TLSEXT_BUG
} = require("constants");

const controller = {
    save: async (req, res) => {
        var params = req.body;
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        Counter.findByIdAndUpdate({
            _id: 'transferencias'
        }, {
            $inc: {
                invoice: 1
            }
        }, function (error, counter) {
            if (error)
                return next(error);
            let last_invoice = counter.invoice + 1;
            //const aleatorio = Math.round(Math.random() * 1000);
            const transferencias = new Transferencia();
            transferencias.institucionContraparte = params.cuenta.institucion.clabe;
            transferencias.empresa = params.centro_costo.nombreCentro;
            transferencias.fechaOperacion = params.fecha_aplicacion;
            const folioOrigen = "";
            transferencias.claveRastreo = params.centro_costo.nombreCentro + last_invoice;
            transferencias.institucionOperante = "90646";
            transferencias.monto = parseFloat(params.importe).toFixed(2);
            transferencias.tipoPago = "1";
            transferencias.tipoCuentaOrdenante = params.cuenta.tipo_cuenta.clave;
            transferencias.nombreOrdenante = params.centro_costo.razon_social;
            transferencias.cuentaOrdenante = params.centro_costo.cuenta_stp;
            transferencias.rfcCurpOrdenante = params.centro_costo.rfcCentro;
            transferencias.tipoCuentaBeneficiario = params.cuenta.tipo_cuenta.clave;
            transferencias.nombreBeneficiario = params.propietario.razon_social || params.propietario.nombreCompleto;
            transferencias.cuentaBeneficiario = params.cuenta.clabe
            transferencias.rfcCurpBeneficiario = params.propietario.rfc;
            transferencias.emailBeneficiario = /* params.propietario.correo1 */ "";
            const tipoCuentaBeneficiario2 = "";
            const nombreBeneficiario2 = "";
            const cuentaBeneficiario2 = "";
            const rfcCurpBeneficiario2 = "";
            transferencias.conceptoPago = params.conceptoPago;
            const conceptoPago2 = "";
            const claveUsuario = "";
            const claveUsuario2 = "";
            const clavePago = "";
            const refCobranza = "";
            transferencias.referenciaNumerica = params.numero_referencia;
            const tipoOperacion = "";
            transferencias.topologia = "T";
            const usuario = "";
            transferencias.medioEntrega = "3";
            transferencias.iva = parseFloat(params.iva).toFixed(2);
            const prioridad = "";
            transferencias.estatus = true;
            transferencias.estatus_stp = "Pendiente";
            var fecha = new Date();
            var fechaMX = moment(fecha).tz("America/Mexico_City");
            transferencias.timestamp = fechaMX._d;
            transferencias.idSTP = "";
            transferencias.descripcionError = "";
            transferencias.resultado = "";
            transferencias.medio = "Transferencia";


            // 1. Obtención de la cadena original.
            var cadenaOriginal = `||${transferencias.institucionContraparte}|`;
            cadenaOriginal += `${transferencias.empresa}|`;
            cadenaOriginal += `${transferencias.fechaOperacion}|`;
            cadenaOriginal += `${folioOrigen}|`;
            cadenaOriginal += `${transferencias.claveRastreo}|`;
            cadenaOriginal += `${transferencias.institucionOperante}|`;
            cadenaOriginal += `${transferencias.monto}|`;
            cadenaOriginal += `${transferencias.tipoPago}|`;
            cadenaOriginal += `${transferencias.tipoCuentaOrdenante}|`;
            cadenaOriginal += `${transferencias.nombreOrdenante}|`;
            cadenaOriginal += `${transferencias.cuentaOrdenante}|`;
            cadenaOriginal += `${transferencias.rfcCurpOrdenante}|`;
            cadenaOriginal += `${transferencias.tipoCuentaBeneficiario}|`;
            cadenaOriginal += `${transferencias.nombreBeneficiario}|`;
            cadenaOriginal += `${transferencias.cuentaBeneficiario}|`;
            cadenaOriginal += `${transferencias.rfcCurpBeneficiario}|`;
            cadenaOriginal += `${transferencias.emailBeneficiario}|`;
            cadenaOriginal += `${tipoCuentaBeneficiario2}|`;
            cadenaOriginal += `${nombreBeneficiario2}|`;
            cadenaOriginal += `${cuentaBeneficiario2}|`;
            cadenaOriginal += `${rfcCurpBeneficiario2}|`;
            cadenaOriginal += `${transferencias.conceptoPago}|`;
            cadenaOriginal += `${conceptoPago2}|`;
            cadenaOriginal += `${claveUsuario}|`;
            cadenaOriginal += `${claveUsuario2}|`;
            cadenaOriginal += `${clavePago}|`;
            cadenaOriginal += `${refCobranza}|`;
            cadenaOriginal += `${transferencias.referenciaNumerica}|`;
            cadenaOriginal += `${tipoOperacion}|`;
            cadenaOriginal += `${transferencias.topologia}|`;
            cadenaOriginal += `${usuario}|`;
            cadenaOriginal += `${transferencias.medioEntrega}|`;
            cadenaOriginal += `${prioridad}|`;
            cadenaOriginal += `${transferencias.iva}||`;
            const private_key = fs.readFileSync(
                certificado,
                "utf-8"
            );
            console.log(cadenaOriginal);
            const signer = crypto.createSign("sha256");
            signer.update(cadenaOriginal);
            signer.end();
            const signature = signer.sign({
                    key: private_key,
                    passphrase: passphrase
                },
                "base64"
            );
            console.log(signature)
            console.log('|||||||||||||||||||||')

            var cadenaOriginal2 = `||${""}|`;
            cadenaOriginal2 += `${transferencias.empresa}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}|`;
            cadenaOriginal2 += `${""}||`;
            console.log(cadenaOriginal2);
            const signer2 = crypto.createSign("sha256");
            signer2.update(cadenaOriginal2);
            signer2.end();
            const signature2 = signer2.sign({
                    key: private_key,
                    passphrase: passphrase
                },
                "base64"
            );
            console.log(signature2)

            console.log('|||||||||||||||||||||')
            var cadenaOriginal3 = `||${""}|`;
            cadenaOriginal3 += `${transferencias.empresa}|`;
            cadenaOriginal3 += `${20200505}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${transferencias.claveRastreo}|`;
            cadenaOriginal3 += `${"90646"}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}|`;
            cadenaOriginal3 += `${""}||`;
            console.log(cadenaOriginal3);
            const signer3 = crypto.createSign("sha256");
            signer3.update(cadenaOriginal3);
            signer3.end();
            const signature3 = signer3.sign({
                    key: private_key,
                    passphrase: passphrase
                },
                "base64"
            );
            console.log(signature3)

            transferencias.firma = signature;
            transferencias.save(async (err, transferenciaStored) => {
                const close = await mongo.close();

                if (err || !transferenciaStored) return res.status(400).send(err);
                return res.status(200).send({
                    ...transferenciaStored._doc
                });
            });
        });
    },

    async ejecutar(req, res) {
        var transID = req.params.id;
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        Transferencia.findById(transID, async (err, transferenciaFind) => {
            const estatusError = "Error";
            const estatusOk = "Ejecutada";

            const transferencia = {
                ...transferenciaFind._doc
            };
            delete transferencia.estatus_stp;
            delete transferencia.timestamp;
            delete transferencia.idSTP;
            delete transferencia.descripcionError;
            delete transferencia.resultado;
            delete transferencia.medio;
            delete transferencia.estatus;
            delete transferencia._id;

            console.log(transferencia);
            /*     /return;
                global.dataT = {

                    ...transferenciaFind._doc
                }; */
            const agent = new https.Agent({
                rejectUnauthorized: false
            });

            await axios
                .put(endpoint_stp, transferencia, {
                    //httpsAgent: agent
                })
                .then((response) => {
                    if (response.data.resultado.descripcionError) {
                        Transferencia.findOneAndUpdate({
                                _id: transID
                            }, {
                                descripcionError: response.data.resultado.descripcionError,
                                idSTP: response.data.resultado.id,
                                estatus_stp: estatusError,
                            },
                            async (err, transferenciaUpdated) => {
                                const close = await mongo.close();
                                return res
                                    .status(400)
                                    .send("ERROR: " + response.data.resultado.descripcionError);
                            }
                        );
                    }

                    if (!response.data.resultado.descripcionError) {
                        Transferencia.findOneAndUpdate({
                                _id: transID
                            }, {
                                descripcionError: response.data.resultado.descripcionError,
                                idSTP: response.data.resultado.id,
                                estatus_stp: estatusOk,
                            },
                            async (err, transferenciaUpdated) => {
                                const close = await mongo.close();
                                console.log(response);
                                return res
                                    .status(200)
                                    .send("EJECUTADA CON EL ID: " + response.data.resultado.id);
                            }
                        );
                    }
                })
                .catch(async (error) => {
                    const close = await mongo.close();
                    return res.status(400).send(error);
                });
        });
    },
    update: async (req, res) => {
        var tranferenciaID = req.params.id;
        var params = req.body;

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        const transferencias = new Transferencia();
        transferencias.claveRastreo = params.claveRastreo;
        transferencias.conceptoPago = params.conceptoPago;
        const conceptoPago2 = "";
        transferencias.cuentaBeneficiario = params.cuentaBeneficiario;
        const cuentaBeneficiario2 = "";
        transferencias.cuentaOrdenante = params.cuentaOrdenante;
        transferencias.emailBeneficiario = params.emailBeneficiario;
        transferencias.empresa = params.empresa;
        transferencias.fechaOperacion = params.fechaOperacion;
        const folioOrigen = "";
        transferencias.institucionContraparte = params.institucionContraparte;
        transferencias.institucionOperante = "90646";
        transferencias.monto = parseFloat(params.monto).toFixed(2);
        transferencias.nombreBeneficiario = params.nombreBeneficiario;
        const nombreBeneficiario2 = "";
        transferencias.nombreOrdenante = params.nombreOrdenante;
        transferencias.rfcCurpBeneficiario = params.rfcCurpBeneficiario;
        const rfcCurpBeneficiario2 = "";
        transferencias.rfcCurpOrdenante = params.rfcCurpOrdenante;
        transferencias.tipoCuentaBeneficiario = params.tipoCuentaBeneficiario;
        const tipoCuentaBeneficiario2 = "";
        transferencias.tipoCuentaOrdenante = params.tipoCuentaOrdenante;
        transferencias.tipoPago = "1";
        transferencias.estatus = true;
        const claveUsuario = "";
        const claveUsuario2 = "";
        const clavePago = "";
        const refCobranza = "";
        transferencias.referenciaNumerica = params.referenciaNumerica;
        const tipoOperacion = "";
        transferencias.topologia = "T";
        const usuario = "";
        transferencias.medioEntrega = "3";
        const prioridad = "";
        transferencias.iva = parseFloat(params.iva).toFixed(2);
        transferencias.estatus_stp = "Pendiente";
        var fecha = new Date();
        var fechaMX = moment(fecha).tz("America/Mexico_City");
        transferencias.timestamp = fechaMX._d;
        const id = "";
        const descripcionError = "";
        const resultado = "";
        transferencias.medio = "Transferencia";


        var cadenaOriginal = `||${transferencias.institucionContraparte}|`;
        cadenaOriginal += `${transferencias.empresa}|`;
        cadenaOriginal += `${transferencias.fechaOperacion}|`;
        cadenaOriginal += `${folioOrigen}|`;
        cadenaOriginal += `${transferencias.claveRastreo}|`;
        cadenaOriginal += `${transferencias.institucionOperante}|`;
        cadenaOriginal += `${transferencias.monto}|`;
        cadenaOriginal += `${transferencias.tipoPago}|`;
        cadenaOriginal += `${transferencias.tipoCuentaOrdenante}|`;
        cadenaOriginal += `${transferencias.nombreOrdenante}|`;
        cadenaOriginal += `${transferencias.cuentaOrdenante}|`;
        cadenaOriginal += `${transferencias.rfcCurpOrdenante}|`;
        cadenaOriginal += `${transferencias.tipoCuentaBeneficiario}|`;
        cadenaOriginal += `${transferencias.nombreBeneficiario}|`;
        cadenaOriginal += `${transferencias.cuentaBeneficiario}|`;
        cadenaOriginal += `${transferencias.rfcCurpBeneficiario}|`;
        cadenaOriginal += `${transferencias.emailBeneficiario}|`;
        cadenaOriginal += `${tipoCuentaBeneficiario2}|`;
        cadenaOriginal += `${nombreBeneficiario2}|`;
        cadenaOriginal += `${cuentaBeneficiario2}|`;
        cadenaOriginal += `${rfcCurpBeneficiario2}|`;
        cadenaOriginal += `${transferencias.conceptoPago}|`;
        cadenaOriginal += `${conceptoPago2}|`;
        cadenaOriginal += `${claveUsuario}|`;
        cadenaOriginal += `${claveUsuario2}|`;
        cadenaOriginal += `${clavePago}|`;
        cadenaOriginal += `${refCobranza}|`;
        cadenaOriginal += `${transferencias.referenciaNumerica}|`;
        cadenaOriginal += `${tipoOperacion}|`;
        cadenaOriginal += `${transferencias.topologia}|`;
        cadenaOriginal += `${usuario}|`;
        cadenaOriginal += `${transferencias.medioEntrega}|`;
        cadenaOriginal += `${prioridad}|`;
        cadenaOriginal += `${transferencias.iva}||`;

        const private_key = fs.readFileSync(certificado, "utf-8");
        const signer = crypto.createSign("sha256");
        signer.update(cadenaOriginal);
        signer.end();
        const signature = signer.sign({
                key: private_key,
                passphrase: passphrase
            },
            "base64"
        );
        params.firma = signature;
        transferencias.firma = signature;
        Transferencia.findOneAndUpdate({
                _id: tranferenciaID
            },
            params, {
                new: true
            },
            async (err, transferenciaUpdated) => {
                const close = await mongo.close();

                if (err) return res.status(500).send({
                    err
                });

                if (!transferenciaUpdated) return res.status(404).send({
                    err
                });

                return res.status(200).send({
                    transferenciaUpdated
                });
            }
        );
    },

    hide: async (req, res) => {
        var transID = req.params.id;
        const estatusCancel = "Cancelada";

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        Transferencia.findOneAndUpdate({
                _id: transID
            }, {
                estatus_stp: estatusCancel,
                estatus: false
            },
            async (err, transferenciaUpdated) => {
                const close = await mongo.close();
                return res.status(200).send("Transferencia Cancelada.");
            }
        );
    },

    getTransferencia: (req, res) => {
        var searchString = req.params.search;
        Transferencia.find({
            rfcCurpBeneficiario: searchString
        }).exec(
            (err, transferencias) => {
                if (err) {
                    return res.status(500).send({});
                }

                if (!transferencias || transferencias.length <= 0) {}

                return res.status(200).send(transferencias);
            }
        );
    },
    getTransferenciasA: async (req, res) => {
        // NUEVO OBTENER EMPRESA
        const now = new Date();
        const fechaMX = moment(now).tz("America/Mexico_City").format("YYYYMMDD");
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        await Transferencia.find({
                estatus_stp: "Pendiente",
                medio: "Transferencia",
                estatus: true,
                fechaOperacion: {
                    $gte: fechaMX
                },
            })
            .sort([
                ["date", "descending"]
            ])
            .exec(async (err, Transferencias) => {
                const close = await mongo.close();

                if (err) return res.status(500).send({});

                if (!Transferencias && Transferencias.length <= 0)
                    return res.status(404).send({});

                return res.status(200).send(Transferencias);
            });
    },

    getTransferenciasDispersion: async (req, res) => {
        var id = req.params.id;
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);
        await Transferencia.find({
                medio: "Dispersion",
                idDispersion: id
            })
            .sort([
                ["date", "descending"]
            ])
            .exec(async (err, Transferencias) => {
                const close = await mongo.close();
                return res.status(200).send(Transferencias);
            });
    },
    response: async (req, res) => {
        const {
            id,
            empresa,
            estado,
            causaDevolucion,
            folioOrigen
        } = req.body;
        const newMail = new Mailer(
            id,
            empresa,
            estado,
            causaDevolucion,
            folioOrigen
        );
        await newMail.send();
        return res.status(200).send({
            estado: "Exito"
        });
    },

    getTransferenciasC: (req, res) => {
        Transferencia.find({
                estatus_stp: "Cancelada"
            })
            .sort([
                ["date", "descending"]
            ])
            .exec((err, transferencias) => {
                if (err) {
                    return res.status(500).send({});
                }
                if (!transferencias || transferencias.length <= 0) {}
                return res.status(200).send(transferencias);
            });
    },

    getTransferencias: (req, res) => {
        Transferencia.find({
                medio: "Transferencia"
            })
            .sort([
                ["date", "descending"]
            ])
            .exec((err, transferencias) => {
                if (err) {
                    return res.status(500).send({});
                }
                if (!transferencias || transferencias.length <= 0) {}
                return res.status(200).send(transferencias);
            });
    },
    buscarTransferencia: (req, res) => {
        var id = req.params.id;
        Transferencia.find({
            _id: id
        }).exec((err, transferencias) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!transferencias || transferencias.length <= 0) {}
            return res.status(200).send(transferencias);
        });
    },
};
module.exports = controller;