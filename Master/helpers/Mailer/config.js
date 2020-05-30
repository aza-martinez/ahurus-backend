const fs = require('fs');
const configMailer = {
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
};

module.exports = configMailer;
