'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var app = express();


var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://ahurus.auth0.com/.well-known/jwks.json'
}),
audience: 'http://ahurus',
issuer: 'https://ahurus.auth0.com/',
algorithms: ['RS256'],
getToken: function fromHeaderOrQuerystring (req) {
if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
}else if (req.query && req.query.token) {
    return res.status(401).send('Acceso Denegado, Token Incorrecto...');
}
// console.log(req);

return null;
}
});




app.use(jwtCheck);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Token Necesario Ó Token Invalido...');
    }
  });


module.exports = app; 