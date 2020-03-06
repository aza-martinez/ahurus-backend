'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaisesNacimientoSchema = Schema({
    clave: Number,
    pais: String,
}, { versionKey: false });

module.exports = mongoose.model('paises', PaisesNacimientoSchema);