'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntidadesFederativasSchema = Schema({
    clave: Number,
    enitdad: String,
}, { versionKey: false });

module.exports = mongoose.model('entidadesfederativas', EntidadesFederativasSchema);
