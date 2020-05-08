const nodemailer = require("nodemailer");
const PDFGenerator = require("./PDFGenerator");
const path = require("path");
const moment = require("moment");
const hbs = require("nodemailer-express-handlebars");

class Mailer {
  constructor(transferencia, centroCosto) {
    const { id, empresa, estado, causaDevolucion, folioOrigen } = transferencia;
    this.centroCosto = centroCosto;
    this.transferencia = transferencia;
    this.id = id;
    this.empresa = empresa;
    this.estado = estado;
    this.causaDevolucion = causaDevolucion;
    this.folioOrigen = folioOrigen;
    this.path_logo_ahurus = path.join("file://", __dirname, "/ahurus_blue.svg");
    // functions
    this.send = this.send.bind(this);
    this.getTransporter = this.getTransporter.bind(this);
    this.getHeadersMail = this.getHeadersMail.bind(this);
  }

  async send() {
    // OBTENEMOS FECHA Y HORA DE TIMESTAMP
    const fecha = moment()
      .tz("America/Mexico_City")
      .utc(this.transferencia.timestamp)
      .format("l");
    const hora = moment()
      .tz("America/Mexico_City")
      .utc(this.transferencia.timestamp)
      .format("LT");

    // Creamos el transporter para el mail
    const transporter = this.getTransporter();
    const transferencia = { ...this.transferencia._doc, fecha, hora };
    // creamos configuración del template HTML
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".handlebars",
          layoutsDir: "./Master/views/",
          partialsDir: "./Master/views/",
        },
        viewPath: "./Master/views/",
      })
    );

    // obtenemos PDF
    const pdfg = new PDFGenerator(transferencia);
    const pdfExistoso = await pdfg.getPdfSpeiExitoso();

    let mailOptions = {
      from: "comprobantes@ahurus.com",
      to: `${this.centroCosto.correo_contacto}`,
      subject: `Comprobante transferencia - ${transferencia.idSTP}`,
      template: "main",
      context: {
        ...transferencia,
        nombre_contacto: this.centroCosto.nombre_contacto,
        fecha,
        hora,
      },
      attachments: [
        {
          filename: "Recibo de pago",
          content: pdfExistoso,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return true;
  }

  getTransporter() {
    return nodemailer.createTransport({
      host: "www.condor3590.startdedicated.com",
      pool: true,
      secure: false,
      auth: {
        user: "comprobantes@ahurus.com",
        pass: "~3]OjA*BvitK",
      },
    });
  }

  getHeadersMail(isExitosa, content) {
    const headers = {
      from: "comprobantes@ahurus.com",
      to: `${this.centroCosto.correo_contacto}`,
      subject: `Comprobante transferencia - ${this.transferencia.id}`,
      html: generateHTMLMail(isExitosa, this.centroCosto, this.transferencia),
    };

    if (isExitosa && this.descripcionError) {
      headers.attachments = [
        {
          filename: "Recibo de pago",
          content: pathPDF,
          contentType: "application/pdf",
        },
      ];
    }

    return headers;
  }
}

module.exports = Mailer;
