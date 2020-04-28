"use strict";

var fs = require("fs");
var request = require("request");
var Dispersion = require("../../Modelos/dispersiones/dispersiones");
var Transferencia = require("../../Modelos/transferencias/transferencias");
var azure = require("azure-storage");
var XLSX = require("xlsx");
const moment = require("moment");
const Counter = require('../../Modelos/counters/counters');
var crypto = require("crypto");
const axios = require("axios");

const KEY_STORAGE =
    "ytq2QZ6b5mqLZxj8BD5Js2ZEHCMpZSVSCYjGXniHE8/YO1jPakmL+RMMwG/nLXxh1lrKcES74na5NCR3hE+K6g==";
const STORAGE_ACCOUNT = "smahurus";
const STORAGE_CONTAINER = "masterahurus";
const MongooseConnect = require('./../../MongooseConnect');


var controller = {
    saveFile: async(req, res) => {
        var file_name = "Documento no subido..";
        //var last_invoice = counter.invoice + 1;
        var params = req.body;
        if (!req.files) { return res.status(404).send({}); }
        var dispersion = new Dispersion();
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        const folio = await Counter.findByIdAndUpdate({ _id: 'dispersiones' }, { $inc: { invoice: 1 } })
        var file_path = req.files.file_path.path;
        var file_name = folio.invoice + '_' + req.files.file_path.originalFilename;
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
            async(e, result, req) => {
                if (e) {
                     console.log("no se guardo...");
                    return;
                }
                console.log(result);


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

                request(fileURLStorage, { encoding: null }, async(error, response, body) => {
                    var workbook = XLSX.read(body, { type: "buffer" });

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

                    Object.keys(FILAS).map(async(fila, index) => {
                        if  (fila.substr(1) === "1") {
                            delete FILAS[fila];
                            return;
                        }

                         switch   (fila.substr(0, 1)) {
                            case "A":
                                registro["institucionContraparte"] = FILAS[fila]["w"];
                                break;
                            case "B":
                                registro["claveRastreo"] = FILAS[fila]["w"];
                                break;
                            case "C":
                                registro["nombreBeneficiario"] = FILAS[fila]["w"];
                                break;
                            case "D":
                                registro["tipoPago"] = FILAS[fila]["w"];
                                break;
                            case "E":
                                registro["tipoCuentaBeneficiario"] = FILAS[fila]["w"];
                                break;
                            case "F":
                                registro["monto"] = FILAS[fila]["w"];
                                break;
                            case "G":
                                registro["cuentaBeneficiario"] = FILAS[fila]["w"];
                                break;
                            case "H":
                                registro["conceptoPago"] = FILAS[fila]["w"];
                                break;
                            case "I":
                                registro["referenciaNumerica"] = FILAS[fila]["w"];
                                break;
                            case "J":
                                registro["emailBeneficiario"] = FILAS[fila]["w"];
                                const centro_costo = JSON.parse(params.centroCosto);

                                //Codigo Para Guardar La Dispersion
                                registro["institucionOperante"] = "90646";
                                registro["empresa"] = centro_costo.nombreCentro;
                                registro["conceptoPago2"] = "";
                                registro["cuentaBeneficiario2"] = "";
                                registro["cuentaOrdenante"] = centro_costo.cuenta_stp;
                                registro["fechaOperacion"] = fechaOperacion;
                                registro["folioOrigen"] = "";
                                registro["nombreBeneficiario2"] = "";
                                registro["nombreOrdenante"] = centro_costo.razon_social; //NECESARIO
                                registro["rfcCurpBeneficiario"] = "ND"; //NECESARIO
                                registro["rfcCurpBeneficiario2"] = "";
                                registro["rfcCurpOrdenante"] = centro_costo.rfcCentro;
                                registro["tipoCuentaBeneficiario2"] = "";
                                registro["tipoCuentaOrdenante"] = "3";
                                registro["claveUsuario"] = "";
                                registro["claveUsuario2"] = "";
                                registro["clavePago"] = "";
                                registro["refCobranza"] = "";
                                registro["tipoOperacion"] = "";
                                registro["topologia"] = "T";
                                registro["usuario"] = "";
                                registro["medioEntrega"] = "3";
                                registro["prioridad"] = "";
                                registro["iva"] = "0.00";
                                registro["resultado"] = "";
                                registro["idSTP"] = "";
                                registro["descripcionError"] = "";

                                var transferencia = new Transferencia();
                                // DATOS DE LA TRANSFERENCIA
                                transferencia.claveRastreo = registro["claveRastreo"];
                                transferencia.conceptoPago = registro["conceptoPago"].trim();
                                const conceptoPago2 = registro["conceptoPago2"];
                                transferencia.cuentaBeneficiario = registro["cuentaBeneficiario"];
                                const cuentaBeneficiario2 = registro["cuentaBeneficiario2"];
                                transferencia.cuentaOrdenante = registro["cuentaOrdenante"];
                                transferencia.emailBeneficiario = registro["emailBeneficiario"];
                                transferencia.empresa = registro["empresa"];
                                transferencia.fechaOperacion = registro["fechaOperacion"];
                                const folioOrigen = registro["folioOrigen"];
                                transferencia.institucionContraparte = registro["institucionContraparte"];
                                transferencia.institucionOperante = registro["institucionOperante"];
                                transferencia.monto = registro["monto"];
                                transferencia.nombreBeneficiario = registro["nombreBeneficiario"].trim();
                                const nombreBeneficiario2 = registro["nombreBeneficiario2"];
                                transferencia.nombreOrdenante = registro["nombreOrdenante"];
                                transferencia.rfcCurpBeneficiario =registro["rfcCurpBeneficiario"];
                                const rfcCurpBeneficiario2 = registro["rfcCurpBeneficiario2"];
                                transferencia.rfcCurpOrdenante = registro["rfcCurpOrdenante"];
                                transferencia.tipoCuentaBeneficiario =registro["tipoCuentaBeneficiario"];
                                const tipoCuentaBeneficiario2 =registro["tipoCuentaBeneficiario2"];
                                transferencia.tipoCuentaOrdenante =registro["tipoCuentaOrdenante"];
                                transferencia.tipoPago = registro["tipoPago"];
                                transferencia.estatus = true;
                                const claveUsuario = registro["claveUsuario"];
                                const claveUsuario2 = registro["claveUsuario2"];
                                const clavePago = registro["clavePago"];
                                const refCobranza = registro["refCobranza"];
                                transferencia.referenciaNumerica = registro["referenciaNumerica"];
                                const tipoOperacion = registro["tipoOperacion"];
                                transferencia.topologia = registro["topologia"];
                                const usuario = registro["usuario"];
                                transferencia.medioEntrega = registro["medioEntrega"];
                                const prioridad = registro["prioridad"];
                                transferencia.iva = registro["iva"];
                                transferencia.estatus_stp = "Pendiente";
                                transferencia.timestamp = fechaMX._d;
                                transferencia.resultado = registro["resultado"];
                                transferencia.idSTP = registro["idSTP"];
                                transferencia.descripcionError = registro["descripcionError"];
                                transferencia.medio = "Dispersion";

                                //DATOS DE LA DISPERSION
                                dispersion.usuario = "USUARIO LOGEADO";
                                dispersion.ruta = fileURLStorage;
                                dispersion.fechaSubida = fechaMX._d;
                                dispersion.estatus = true;
                                dispersion.estatus_stp = "Pendiente";
                                dispersion.fechaOperacion = fechaOperacion;

                                //console.log(req.user['http://localhost:3000/user_metadata'])

                                // 1. Obtención de la cadena original.
                                var cadenaOriginal = `||${transferencia.institucionContraparte}|`;
                                cadenaOriginal += `${transferencia.empresa}|`;
                                cadenaOriginal += `${transferencia.fechaOperacion}|`;
                                cadenaOriginal += `${folioOrigen}|`;
                                cadenaOriginal += `${transferencia.claveRastreo}|`;
                                cadenaOriginal += `${transferencia.institucionOperante}|`;
                                cadenaOriginal += `${transferencia.monto}|`;
                                cadenaOriginal += `${transferencia.tipoPago}|`;
                                cadenaOriginal += `${transferencia.tipoCuentaOrdenante}|`;
                                cadenaOriginal += `${transferencia.nombreOrdenante}|`;
                                cadenaOriginal += `${transferencia.cuentaOrdenante}|`;
                                cadenaOriginal += `${transferencia.rfcCurpOrdenante}|`;
                                cadenaOriginal += `${transferencia.tipoCuentaBeneficiario}|`;
                                cadenaOriginal += `${transferencia.nombreBeneficiario}|`;
                                cadenaOriginal += `${transferencia.cuentaBeneficiario}|`;
                                cadenaOriginal += `${transferencia.rfcCurpBeneficiario}|`;
                                cadenaOriginal += `${transferencia.emailBeneficiario}|`;
                                cadenaOriginal += `${tipoCuentaBeneficiario2}|`;
                                cadenaOriginal += `${nombreBeneficiario2}|`;
                                cadenaOriginal += `${cuentaBeneficiario2}|`;
                                cadenaOriginal += `${rfcCurpBeneficiario2}|`;
                                cadenaOriginal += `${transferencia.conceptoPago}|`;
                                cadenaOriginal += `${conceptoPago2}|`;
                                cadenaOriginal += `${claveUsuario}|`;
                                cadenaOriginal += `${claveUsuario2}|`;
                                cadenaOriginal += `${clavePago}|`;
                                cadenaOriginal += `${refCobranza}|`;
                                cadenaOriginal += `${transferencia.referenciaNumerica}|`;
                                cadenaOriginal += `${tipoOperacion}|`;
                                cadenaOriginal += `${transferencia.topologia}|`;
                                cadenaOriginal += `${usuario}|`;
                                cadenaOriginal += `${transferencia.medioEntrega}|`;
                                cadenaOriginal += `${prioridad}|`;
                                cadenaOriginal += `${transferencia.iva}||`;
                                const private_key = fs.readFileSync(
                                    "certs/llavePrivada.pem",
                                    "utf-8"
                                );
                                const signer = crypto.createSign("sha256");
                                signer.update(cadenaOriginal);
                                signer.end();
                                const signature = signer.sign({ key: private_key, passphrase: "wiQy5DkS4h" },
                                    "base64"
                                );
                                transferencia.idDispersion = dispersion._id;
                                transferencia.firma = signature;
                                registro["firma"] = signature;
                                dispersion.idTransferencia.push(transferencia._id);
                                await  transferencia.save((err, transStored) => {
                                    if (err || !transStored) {}
                                     console.log(transStored);
                                    });
                                     await dispersion.save((err, dispersionStored) => {
                                        if (err || !dispersionStored) {}
                                          console.log(dispersionStored);
                                });

                                // registro = {};
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
    },
    getTransferenciasC: async(req, res) => {

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        const transferencias = Transferencia.find({ estatus_stp: "Cancelada" }).exec(
            async(err, transferencias) => {
                const close = await mongo.close();

                if (err) return res.status(500).send({});

                return res.status(200).send(transferencias);
            }
        );
    },
    hide: async(req, res) => {
        var transID = req.params.id;
        const estatusCancel = "Cancelada";

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        const dispersiones = Dispersion.findOneAndUpdate({ _id: transID }, { estatus: false },
            (err, transferenciaUpdated) => {
                Transferencia.updateMany({ idDispersion: transID }, {
                        estatus_stp: estatusCancel,
                        estatus: false,
                        estatus_stp: "Ejecución Cancelada"
                    },
                    async(err, transferenciaUpdated) => {
                        const close = await mongo.close();
                        return res.status(200).send("Dispersion Cancelada Correctamente");
                    }
                );
            }
        );
    },
    getAllDispersion: async(req, res) => {
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        await Dispersion.find({ estatus: true })
            .exec(async(err, registros) => {
                const close = await mongo.close();

                if (err) return res.status(500).send({});

                return res.status(200).send(registros);
            });
    },
    buscarDispersion: async(req, res) => {
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);
        var searchString = req.params.search;

        const dispersion = Dispersion.find({ _id: searchString }).exec(async(err, dispersion) => {
            const close = await mongo.close();

            if (err) return res.status(500).send({});

            return res.status(200).send(dispersion);
        });
    },
    getDispersiones: async(req, res) => {
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        const dispersiones = Dispersion.find({ estatus: true, estatus_stp: "Pendiente" })
            .populate("idTransferencia")
            .exec(async(err, registros) => {
                const close = await mongo.close();

                if (err) return res.status(500).send({});

                return res.status(200).send(registros);
            });
    },
    ejecutar: async(req, res) => {
        var idDispersion = req.params.id;
        var i;
        var dataT = "";
        var idTransferencia = "";
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        await Transferencia.find({
            idDispersion: idDispersion,
            estatus: true
        }).exec(async(err, transferenciasFind) => {
            // inicio del FIND, operaciones con las transferencias encontradas
            //console.log(transferenciasFind);
            for (i = 0; i < transferenciasFind.length; i++) {
                //Inicio del FOR
                dataT = transferenciasFind[i];
                idTransferencia = dataT._id;

                await axios
                    .put(
                        "https://demo.stpmex.com:7024/speidemows/rest/ordenPago/registra", {...dataT._doc }
                    )
                    .then(respuesta_stp => {
                        // inicio de las respuestas de STP Mandamos a ejecutar la transferencia

                        if (respuesta_stp.data.resultado.descripcionError) {
                            Transferencia.findOneAndUpdate({ _id: idTransferencia }, {
                                    descripcionError: respuesta_stp.data.resultado.descripcionError,
                                    idSTP: respuesta_stp.data.resultado.id,
                                    estatus_stp: "Error"
                                },
                                (err, transferenciaUpdated) => {}
                            );
                        }
                        if (!respuesta_stp.data.resultado.descripcionError) {
                            Transferencia.findOneAndUpdate({ _id: idTransferencia }, {
                                    descripcionError: respuesta_stp.data.resultado.descripcionError,
                                    idSTP: respuesta_stp.data.resultado.id,
                                    estatus_stp: "Ejecutada"
                                },
                                (err, transferenciaUpdated) => {}
                            );
                        }
                    }); // FIN de la API Ejecutar
            } //FIN DEL FOR
        });

        Dispersion.findOneAndUpdate({ _id: idDispersion }, { estatus_stp: "Ejecutada" },
            (err, transferenciaUpdated) => {}
        );

        const close = await mongo.close();
        return res.status(200).send("Dispersión Terminada De Procesar");
    },

    response: async(req, res) => {
        var transferenciaID = req.params.id;
        var params = req.body;

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        const transferencia = Transferencia.findOneAndUpdate({ _id: transferenciaID },
            params, { new: true },
            async(err, transferenciaResponse) => {
                const close = await mongo.close();

                if (err) return res.status(500).send({});

                return res.status(200).send({ transferenciaResponse });
            }
        );
    }
};

module.exports = controller;