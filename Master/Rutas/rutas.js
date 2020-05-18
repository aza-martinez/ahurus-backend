'use strict';
//Variables Generales
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
//Variable De Seguridad
const auth0 = require('../Middleware/auth0');
//Variable Para Obtener El Perfil Del Usuario
const userProfile = require('./../Middleware/getUserProfile');
//Variables De Los Controladores
const UserController = require('../Controladores/usuarios/usuarios');
var TransferController = require('../Controladores/transferencias/transferencias');
var GeneratorController = require('../Controladores/transferencias/generadorFirma');
var TransferStatusController = require('../Controladores/transferencias/cambiosEstados');
var PaymentTypesController = require('../Controladores/tipos_pagos/tipos');
var AccountsTypeController = require('../Controladores/tipos_cuentas/tipos_cuentas');
const EconomicActivitiesController = require('./../Controladores/ActividadesEconomicas');
const CentrosController = require('../Controladores/centros/centros');
var ReturnsController = require('../Controladores/devoluciones/devoluciones');
const EntitiesController = require('../Controladores/EntidadesFederativas/EntidadesFederativas');
var ErrorController = require('../Controladores/errores/errores');
const AccountsController = require('../Controladores/cuentas/cuentas');
const OwnersController = require('../Controladores/propietarios/index');
const OwnerValidate = require('./../Controladores/cuentas/validarPropietarioExistente');
const AccountValidate = require('./../Middleware/validate/validateCuenta');
var DispersionController = require('../Controladores/dispersiones/dispersiones');
var PlazasController = require('../Controladores/plazas/plazas');
const CountriesController = require('./../Controladores/PaisesNacimiento');
var InstitutionsController = require('../Controladores/instituciones/instituciones');
var ReportsController = require('../Controladores/reportes/reportes');
var ResourcesController = require('../Controladores/resources/resources.js');

// Rutas  De Los Usuarios.
router.post('/usuario/guardar', [auth0], UserController.save);
router.get('/usuarios/listarA/:last?', [auth0], UserController.getUsuariosA);
router.get('/usuarios/listarI/:last?', [auth0], UserController.getUsuariosI);
router.get('/usuario/buscar/:id', [auth0], UserController.getUsuario);
router.get('/usuarios/filtrar/:search', [auth0], UserController.search);
router.put('/usuarios/desactivar/:id', [auth0], UserController.hide);
//Rutas De Las Transferencias.
router.get('/transferencias/listar/:search?', auth0, TransferController.getTransferencias);
router.get('/transferencias/listarCanceladas/:search?', auth0, TransferController.getTransferenciasC);
router.get('/transferencias/listarA/:search?', auth0, TransferController.getTransferenciasA);
router.get('/transferencias/buscar/:search', auth0, TransferController.getTransferencia);
router.get('/transferencias/buscarTransferencia/:id', auth0, TransferController.buscarTransferencia);
router.get('/transferencia/ejecutar/:id', auth0, TransferController.ejecutar);
router.post('/transferencia/guardar/:id?', auth0, TransferController.save);
router.put('/transferencia/cancelar/:id', [auth0], TransferController.hide);
router.put('/transferencia/modificar/:id', [auth0], TransferController.update);
router.get('/transferencias/listarTD/:id', [auth0], TransferController.getTransferenciasDispersion);
router.put('/cambioDeEstado/', TransferController.response);
router.get('/generarFirmaEmpresa/', TransferController.generarFirmaEmpresa);
// Rutas Del Generador De Firma.
router.post('/transferencias/generarFirma/:?', GeneratorController.generar);
// Rutas Del Cambio De Estado.
router.put('/transferencia/CambioEstado/:id?', TransferStatusController.update);
// Rutas De Los Tipos De Pago.
router.post('/tipos_pagos/guardar', [auth0], PaymentTypesController.save);
router.get('/tipos_pagos/listarA/:last?', auth0, PaymentTypesController.getTiposPagosA);
router.get('/tipos_pagos/listarI/:last?', [auth0], PaymentTypesController.getTiposPagosI);
router.get('/tipos_pagos/buscar/:id', [auth0], PaymentTypesController.getTipoPago);
router.put('/tipos_pagos/desactivar/:id', [auth0], PaymentTypesController.update);
//Rutas De Los Tipos De Cuenta.
router.post('/tipo_cuenta/guardar', [auth0], AccountsTypeController.save);
router.get('/tipos_cuentas/listarA/:last?', [auth0], AccountsTypeController.getTiposA);
router.get('/tipos_cuentas/listarI/:last?', [auth0], AccountsTypeController.getTiposI);
router.get('/tipo_cuenta/buscar/:id', [auth0], AccountsTypeController.getTipo);
router.put('/tipo_cuenta/desactivar/:id', [auth0], AccountsTypeController.update);
router.get('/tipos_cuentas/filtrar/:search', [auth0], AccountsTypeController.search);
//Rutas De Las Actividades Economicas.
router.get('/actividades-economicas/listar', [auth0], EconomicActivitiesController.getActividadesEconomicas);
//Rutas De Los Centros De Costo.
router.post('/centros/guardar', [auth0], CentrosController.save);
router.get('/centros/listarA/:last?', [auth0], CentrosController.getCCA);
router.get('/centros/listarI/:last?', [auth0], CentrosController.getCCI);
router.get('/centros/buscar/:id', [auth0], CentrosController.getCC);
router.put('/centros/desactivar/:id', [auth0], CentrosController.update);
//Rutas De Las Cuentas.
router.get('/cuentas/clientes/listarA', auth0, AccountsController.getCuentasCA);
router.get('/cuentas/proveedores/listarA/:last?', auth0, AccountsController.getCuentasPA);
router.get('/cuentas/propietarios/listarA/:last?', auth0, AccountsController.getPropietariosA);
router.get('/cuentas/propietarios/buscar/:search', [auth0], AccountsController.getPropietario);
router.get('/cuentas/propietarios/listar/:search', [auth0], AccountsController.getCuentasPropietarios);
router.get('/cuentas/listarCuentas/:last?', [auth0], AccountsController.getCuentas);
router.post('/cuentas/guardar', [auth0, AccountValidate], AccountsController.save);
router.post('/cuentas/importar', [auth0, multipartMiddleware], OwnersController.saveFile);
router.put('/cuenta/desactivar/:id', [auth0], AccountsController.hide);
router.put('/cuenta/modificar/:id', [auth0], AccountsController.update);
router.delete('/cuenta/elimiar/:id', [auth0], AccountsController.delete);
//Rutas De Las Devoluciones.
router.post('/devoluciones/guardar', [auth0], ReturnsController.save);
router.get('/devoluciones/listar/:last?', [auth0], ReturnsController.getDevoluciones);
router.get('/devoluciones/buscar/:id', [auth0], ReturnsController.getDevolucion);
//Rutas De Las Dispersiones.
router.post('/dispersiones/importar/:id?', [auth0, multipartMiddleware], DispersionController.saveFile);
router.get('/dispersiones/listar/:search?', auth0, DispersionController.getDispersiones);
router.get('/dispersiones/listarDispersiones/:search?', auth0, DispersionController.getAllDispersion);
router.get('/dispersiones/buscarDispersion/:search', [auth0], DispersionController.buscarDispersion);
router.get('/dispersion/ejecutar/:id', [auth0], DispersionController.ejecutar);
router.put('/response/:id', [auth0], DispersionController.response);
router.put('/dispersiones/cancelar/:id', [auth0], DispersionController.hide);
router.get('/dispersiones/listarCanceladas/:search?', [auth0], DispersionController.getTransferenciasC);
//Rutas De Las Entidades Federativas.
router.get('/entidades-federativas/listar', [auth0], EntitiesController.getEntidadesFederativas);
//Rutas De Los Errores.
router.post('/errores/guardar', [auth0], ErrorController.save);
router.get('/errores/listar/:last?', [auth0], ErrorController.getErrores);
router.get('/errores/buscar/:id', [auth0], ErrorController.getError);
//Rutas De Las Instituciones.
router.post('/instituciones/guardar', [auth0], InstitutionsController.save);
router.get('/instituciones/listar/:last?', [auth0], InstitutionsController.getInstituciones);
router.get('/instituciones/buscar/:id', [auth0], InstitutionsController.getInstitucion);
router.get('/instituciones/filtrar/:search', [auth0], InstitutionsController.search);
//Rutas De Los Paises.
router.get('/paises-nacimiento/listar', [auth0], CountriesController.getPaisesNacimiento);
//Rutas De Las Plazas.
router.post('/plaza/guardar', [auth0], PlazasController.save);
router.get('/plazas/listar/:last?', [auth0], PlazasController.getPlazas);
router.get('/plaza/buscar/:id', [auth0], PlazasController.getPlaza);
router.get('/plazas/filtrar/:search', [auth0], PlazasController.search);
//Rutas De Los Propietarios.
router.post('/propietario/guardar', [auth0, OwnerValidate], (...args) => OwnersController.crearPropietario(...args));
router.get('/propietarios/personasFisicas/listarI', [auth0], (...args) => OwnersController.getPropietariosPFI(...args));
router.get('/propietarios/personasFisicas/listarA', [auth0], (...args) => OwnersController.getPropietariosPFA(...args));
router.get('/propietarios/personasMorales/listarI/:last?', [auth0], (...args) => OwnersController.getPropietariosPMI(...args));
router.get('/propietarios/personasMorales/listarA/:last?', [auth0], (...args) => OwnersController.getPropietariosPMA(...args));
router.get('/propietarios/listar/:last?', auth0, (...args) => OwnersController.getPropietarios(...args));
router.get('/propietario/buscar/:id', [auth0], (...args) => OwnersController.getPropietario(...args));
router.put('/propietario/desactivar/:id', [auth0], (...args) => OwnersController.update(...args));
//Rutas De Los Reportes.
router.post('/report/transfer/', [], ReportsController.getReportTransfer);
router.post('/report/balance/', [], ReportsController.getBalance);
router.post('/report/dispersion/', [], ReportsController.getReportDisper);
//Rutas De Los Recursos.
router.get('/bancos/listar/', ResourcesController.getBancos);
router.get('/tiposPago/listar/', ResourcesController.getTipos);

module.exports = router;
