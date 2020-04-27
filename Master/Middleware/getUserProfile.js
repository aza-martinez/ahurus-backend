"use strict";

const axios = require("axios");


/**
 * la funcion getUserProfile,
 * realiza una petición a un servicio de auth0 para 
 * obtener el perfil del usuario y una vez obtenido lo
 * manda al controlador en el request
 */
const getUserProfile = async(req, res, next) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization;
        await axios
            .get("https://ahurus.auth0.com/userinfo", {
                headers: { Authorization: accessToken }
            })
            .then(({ data }) => {
                req.empresa = data['http://localhost:3000/user_metadata'].empresa;
                next();
            })
            .catch(error => res.status(401).send(error));
    }
};

module.exports = getUserProfile;