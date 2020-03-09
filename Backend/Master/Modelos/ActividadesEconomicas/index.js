'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActividadesEconomicasSchema = Schema({
    clave: Number,
    actividadEconomica: String,
}, { versionKey: false });

module.exports = mongoose.model('actividadeseconomicas', ActividadesEconomicasSchema);