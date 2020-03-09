'use strict'

const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    nombre: String,
    perfil: String,
    correo: String,
    telefono: String,
    usuario: String,
    password: String,
    estatus: Boolean,
    timestamp: Date,
    }, { versionKey: false });

module.exports = mongoose.model('Usuario', UsuariosSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colección