'use strict'
var Propietario = require('../../Modelos/propietarios/propietarios');

const validarPropietarioExtistente = async (req, res, next) => {
    try {
        const params = req.body;
        const propietarioId = params.propietario;

        await Propietario.findById(propietarioId, (err, propietario) => {
            if (err) return res.status(500).send({});

            if (!propietario || propietario.length <= 0 ||propietario.length >= 0) 
                return next();
        });
    } catch (error) {
        return res.status(404).send({error: 'error'});
    }

}

module.exports = validarPropietarioExtistente;
