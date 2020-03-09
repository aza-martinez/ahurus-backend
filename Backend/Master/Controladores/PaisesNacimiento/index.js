'use strict'

const PaisNacimiento = require('./../../Modelos/PaisesNacimiento');
const MongooseConnect = require('./../../MongooseConnect');

const controller = {
    getPaisesNacimiento: async (req, res) => {
        const SERVER_BD = req.empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        const query = PaisNacimiento.find({});
        query.sort('pais').exec(async (err, paisesNacimiento) => {
            const close = await mongo.close();

            if (err) return res.status(500).send({});

            if (!paisesNacimiento) return res.status(404).send({});

            return res.status(200).send(paisesNacimiento);
        })
    }
}

module.exports = controller;