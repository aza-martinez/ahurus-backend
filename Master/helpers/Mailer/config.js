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
    host: "www.condor3590.startdedicated.com",
    pool: true,
    secure: false,
    auth: {
      user: "comprobantes@ahurus.com",
      pass: "~3]OjA*BvitK",
    },
  },
  templateExito: 'Exito',
  templateError: 'Error',
  templateBeneficiario: 'Beneficiario'
};

module.exports = configMailer;
