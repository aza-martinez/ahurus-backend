'use strict'

var Institucion = require('../../Modelos/instituciones/instituciones');
const MongooseConnect = require('./../../MongooseConnect');

var controller = {

    save: async (req, res) => {
        var params = req.body;

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        var institucion = new Institucion();
        institucion.clabe = params.clabe;
        institucion.participante = params.participante;
        const _institucion = institucion.save(async (err, institucionStored) => {
            const close = await mongo.close();
            return res.status(200).send({ ...institucionStored._doc });
        });
    },

    getInstituciones: async (req, res) => {
        var query = Institucion.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        query.sort('-_id').exec(async (err, instituciones) => {
            const close = await mongo.close();

            if (err) return res.status(500).send({});

            return res.status(200).send([...instituciones]);
        });
    },

    getInstitucion: async (req, res) => {
        var institucionId = req.params.id;
        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

        if (!institucionId || institucionId == null) return res.status(404).send({});

        Institucion.findById(institucionId, async (err, institucion) => {
            const close = await mongo.close();
            return res.status(200).send({...institucion._doc });
        });
    },

    search: async (req, res) => {
        var searchString = req.params.search;

        const SERVER_BD = req.user['http://localhost:3000/user_metadata'].empresa;
        const mongo = new MongooseConnect();
        await mongo.connect(SERVER_BD);

       const institucion = Institucion.find({ "participante": { "$regex": searchString, "$options": "i" } })
            .exec(async (err, instituciones) => {
                const close = await mongo.close();

                if (err) return res.status(500).send({});

                return res.status(200).send({ instituciones });
            });
    }

};

module.exports = controller;