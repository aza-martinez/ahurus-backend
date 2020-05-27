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
