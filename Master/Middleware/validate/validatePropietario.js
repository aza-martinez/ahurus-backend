const validator = require("validator");

const validatePropietario = (req, res, next) => {
  try {
    const params = req.body;
    const validar_id_terceros = !validator.isEmpty(params.id_terceros);
    const validar_rfc = !validator.isEmpty(params.rfc);
    const validar_tipo_propietario = !validator.isEmpty(params.tipo_propietario);
    let validar_razon_social, validar_nombrePF, validar_nombre_contacto;

    if (params.tipo_propietario && params.tipo_propietario === "personaMoral") {
        validar_razon_social = !validator.isEmpty(params.razon_social);
        validar_nombre_contacto = !validator.isEmpty(params.nombre_contacto);
    }

    if (params.tipo_propietario === "personaFisica") {
      validar_nombrePF = !validator.isEmpty(params.nombre);
    }

    const validar_correo1 = !validator.isEmpty(params.correo1);
    const validar_telefono = !validator.isEmpty(params.telefono);

    if (validar_id_terceros && validar_rfc && validar_correo1 && validar_telefono && validar_tipo_propietario) {
        if (params.tipo_propietario === "personaMoral") {
            if (!validar_razon_social && !validar_nombre_contacto) {
              throw new Error();
            }
        }

        if (params.tipo_propietario === "personaFisica") {
          if (!validar_nombrePF && !validar_apellidoMPF && !validar_apellidoPPF) {
            throw new Error();
          }
        }

        next();
    }
  } catch (error) {
    return res.status(400).send("faltan datos...");
  }
};

module.exports = validatePropietario;
