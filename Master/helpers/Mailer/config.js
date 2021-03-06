const fs = require('fs');
const configMailer = {
	engine: {
		viewEngine: {
			extName: '.handlebars',
			layoutsDir: './Master/views/Mail',
			partialsDir: './Master/views/Mail',
			defaultLayout: false,
		},
		viewPath: './Master/views/Mail',
	},
	transporter: {
		//OK
		host: '148.72.144.148',
		secure: true,
		port: 465,
		pool: true,

		auth: {
			user: 'comprobantes@ahurus.com',
			pass: '2IOPBp6Q3715',
		}, //OK
		tls: {
			rejectUnauthorized: false,
		},
	},
	templateExito: 'Exito',
	templateError: 'Error',
	templateBeneficiario: 'Beneficiario',
};

module.exports = configMailer;
