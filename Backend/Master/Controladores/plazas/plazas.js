'use strict'
const pdfMakePrinter = require('pdfmake/src/printer');
const fs = require('fs');
var validator = require('validator');
var Plaza = require('../../Modelos/plazas/plazas');
var sha256 = require('js-sha256');

var controller = {
    save: (req, res) => {
        var params = req.body;
        try {
            !validator.isEmpty(params.numero);
            !validator.isEmpty(params.nombre);
        } catch (err) {
            return res.status(200).send({});
        }
        var plaza = new Plaza();
        plaza.nombre = params.nombre;
        plaza.numero = params.numero;
        plaza.save((err, plazaStored) => {
            if (err || !plazaStored) {
                return res.status(404).send({});
            }
            return res.status(200).send({ ...plazaStored._doc });
        });
    },

    getPlazas: (req, res) => {

        var query = Plaza.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        query.sort('-_id').exec((err, plazas) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!plazas) {
                return res.status(404).send({});
            }










            return res.status(200).send({ plazas });
        });
    },

    getPlaza: (req, res) => {
        var plazaId = req.params.id;
        if (!plazaId || plazaId == null) {
            return res.status(404).send({});
        }
        Plaza.findById(plazaId, (err, plaza) => {
            if (err || !plazaId) {
                return res.status(404).send({});
            }/* 
            var PDFDocument, doc;
            var fs = require('fs');
            PDFDocument = require('pdfkit');
            doc = new PDFDocument;
            doc.pipe(fs.createWriteStream('PLAZAS.pdf'));
            // lógica para crear el documento PDF va aquí
            // Establecemos un titulo y le pasamos las coordenadas X y Y.
            doc.fontSize(15).text('¡ Mi Titulo !', 50, 50);

            // Establecemos la anchura y el tipo de alineación de nuestros parrafos.
            doc.text(`||${plaza.nombre}`, {
                width: 410, // anchura en px
                align: 'left' // tipo de alineación (left, center, right o justify)
            });
            doc.end();

            var fs = require('fs');


            var jsn = [`${plaza.nombre} \t ${plaza.numero}  \n`];

            var data = '';
            for (var i = 0; i < jsn.length; i++) {
                var  data = data + jsn[i].nombre + '\t' + jsn[i].numero + '\n';
            }
            fs.appendFile('Filename.xls', jsn, (err) => {
                if (err) throw err;
                console.log('File created');
            });

            fs.readFile('Filename.xls', 'utf-8', (err, data) => {
                if(err) {
                  console.log('error: ', err);
                } else {
                  console.log(data);
                }
              });



 */





            return res.status(200).send({ ...plaza._doc });
        });





    },

    search: (req, res) => {
        var searchString = req.params.search;
        Plaza.find({
            "$or": [
                { "nombre": { "$regex": searchString, "$options": "i" } },
                { "numero": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, plazas) => {
                if (err) {
                    return res.status(500).send({});
                }
                if (!plazas || plazas.length <= 0) {
                    return res.status(404).send({});
                }
                return res.status(200).send({ plazas });
            });
    }


































}; // end controller

module.exports = controller;