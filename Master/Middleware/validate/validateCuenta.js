const validator = require('validator');

const validateCuenta = (req, res, next) => {
  try {
    const params = req.body;

    if (
      validator.isEmpty(params.descripcion) &&
      validator.isEmpty(params.clabe) &&
      validator.isEmpty(params.tipo_registro) &&
      validator.isEmpty(params.propietario) &&
      validator.isEmpty(params.estatus) &&
      validator.isEmpty(params.institucion) &&
      validator.isEmpty(params.tipo_cuenta)
    ) {
      throw new Error();
    }

    next();
  } catch (error) {
    return res.status(400).send('Faltan Datos Cuenta...');
  }
};

module.exports = validateCuenta;
