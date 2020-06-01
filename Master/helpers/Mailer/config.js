const fs = require('fs');
const configMailer = {
<<<<<<< HEAD
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
=======
  engine: {
    viewEngine: {
      extName: ".handlebars",
      layoutsDir: "./Master/views/Mail",
      partialsDir: "./Master/views/Mail",
      defaultLayout: false,
    },
    viewPath: "./Master/views/Mail",
  },
  transporter: {
    host: "148.72.144.148",
    pool: true,
    secure: true,
    auth: {
      user: "comprobantes@ahurus.com",
      pass: "2IOPBp6Q3715",
    },
    tls: {
      rejectUnauthorized: false
    }
  },
  templateExito: 'Exito',
  templateError: 'Error',
  templateBeneficiario: 'Beneficiario'
>>>>>>> 5d9b43cf43904d08a339f6e5ac0a5cfb1395bb3d
};

module.exports = configMailer;
