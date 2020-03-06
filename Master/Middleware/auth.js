const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const jwToken = req.header('Authorization');
    if(!jwToken) return res.status(401).send('Acceso Denegado, Se Necesita Un Token...');
    try {
       // const payload = jwt.verify(jwToken, '3W9xlbaBekaF9IruvSAlXoOFRwcEoNAQumG9_dInH1-JjWyEwilvfCZ4OmoatNJM');
       const payload = jwt.verify(jwToken, process.env.SECRET_KEY_JWT);
       console.log(process.env.SECRET_KEY_JWT);
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).send('Acceso Denegado, Token Incorrecto...');
    }
}

module.exports = auth;