'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PLazasSchema = Schema({
    numero: String, 
    nombre: String, 
    timestamp: Date,
}, 
{versionKey: false}
);

module.exports = mongoose.model('Plazas', PLazasSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colección
