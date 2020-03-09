
var validator = require('validator');
var Usuario = require('../../Modelos/usuarios/usuarios');
var auth = require('../../Controladores/usuarios/auth');
var moment = require('moment');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

var controller = {
    save: async(req, res) => {
       try {
        var params = req.body;
        var usuario = new Usuario();
        let user = await Usuario.findOne({ 'usuario': params.usuario});
        if (user) return res.status(400).send('Usuario Ya Existe....')
        usuario.nombre = params.nombre;
        usuario.perfil = params.perfil;
        usuario.correo = params.correo;
        usuario.telefono = params.telefono;
        usuario.usuario = params.usuario;     
        const password = params.password;   
        const hash = bcryptjs.hashSync(password,11);
        usuario.password = hash;
        usuario.estatus = true;
        var fechaMX = new Date();        
        fechaMX.setUTCHours(fechaMX.getUTCHours());
        usuario.timestamp=fechaMX;
        usuario.save((err, usuarioStored) => {
            if (err || !usuarioStored) {
                console.log(err);
                return res.status(404).send({});
            }
            res.status(200).send({
                _id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                telefono: usuario.telefono,
                usuario: usuario.usuario
            })
            
          });

        } catch (error) {
           
        }
    },

    getUsuariosA: async(req, res) => {
        var query = Usuario.find({ "estatus": true }, );
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        query.sort('-_id').exec((err, usuarios) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!usuarios) {
                return res.status(404).send({});
            }
            return res.status(200).send({ usuarios });
        });
        
    },

    getUsuariosI: (req, res) => {
        var query = Usuario.find({ "estatus": false }, );
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        query.sort('-_id').exec((err, usuarios) => {
            if (err) {
                return res.status(500).send({});
            }
            if (!usuarios) {
                return res.status(404).send({});
            }
            return res.status(200).send({ usuarios });
        });
    },

    getUsuario: (req, res) => {
        var usuarioId = req.params.id;
        if (!usuarioId || usuarioId == null) {
            return res.status(404).send({});
        }
        Usuario.findById(usuarioId, (err, usuario) => {
            if (err || !usuario) {
                return res.status(404).send({});
            }
            return res.status(200).send({...usuario._doc });
        });
    },

    hide: (req, res) => {
        var usuarioID = req.params.id;
        var params = req.body; 
        try {
            params.estatus = false;
            var fechaMX = new Date();
            
        fechaMX.setUTCHours(fechaMX.getUTCHours());
            params.timestamp=fechaMX;
        } catch (err) {
        }
        Usuario.findOneAndUpdate({ _id: usuarioID }, params, { new: true }, (err, usuarioHide) => {
            if (err) {
                console.log('BIEN1');
                return res.status(500).send({});
            }
            if (!usuarioHide) {}
            return res.status(200).send({ usuarioHide });
        });
    },

    search: (req, res) => {
        var searchString = req.params.search;
        Usuario.find({
                "$or": [
                    { "usuario": { "$regex": searchString, "$options": "i" } },
                    { "nombre": { "$regex": searchString, "$options": "i" } },
                    { "correo": { "$regex": searchString, "$options": "i" } }
                ]
            })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(500).send({});
                }
                if (!usuarios || usuarios.length <= 0) {
                    return res.status(404).send({});
                }
                return res.status(200).send({ usuarios });
            });
    }
};
module.exports = controller;