const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const path = require("path");
const generateHTMLReciboExitoso = require("./generateHTMLReciboExitoso");
const generateHTMLMail = require("./generateHTMLMail");

class Mailer {
  constructor(id, empresa, estado, causaDevolucion, folioOrigen) {
    this.id = id;
    this.empresa = empresa;
    this.estado = estado;
    this.causaDevolucion = causaDevolucion;
    this.folioOrigen = folioOrigen;
    this.path_logo_ahurus = path.join("file://", __dirname, "/ahurus_blue.svg");
    // functions
    this.send =  this.send.bind(this);
    this.getTransporter =  this.getTransporter.bind(this);
    this.getHeadersMail =  this.getHeadersMail.bind(this);
    this.generatePDF =  this.generatePDF.bind(this);

  }

  async send() {
    const transporter = this.getTransporter();
    this.generatePDF()
      .then(stream => {
        const headerdMail = this.getHeadersMail(stream);
        transporter.sendMail(headerdMail, (err, info) => {
          if (err) console.log("ERROR", err);

          console.log("INFO", info);
        });
      })
      .catch(error => console.log(error));

    return true;
  }

  getTransporter () { 
    return nodemailer.createTransport({
    name: "https://www.ahurus.com",
    host: "mail.ahurus.com",
    port: 465,
    pool: true,
    secure: true,
    auth: {
      user: "comprobantes@ahurus.com",
      pass: "yimt;kyp9TzmLdb"
    }
  });
  }

  getHeadersMail(pathPDF) {
    return {
      from: "comprobantes@ahurus.com",
      to: "alejandro.rendon@itcom.mx",
      subject: "Probando correos de recibos",
      html: generateHTMLMail(),
      attachments: [
        {
          filename: "recibo de pago",
          content: pathPDF,
          contentType: "application/pdf"
        }
      ]
    }
  };

  generatePDF() {
    return new Promise((resolve, reject) => {
      const htmlGenerated = generateHTMLReciboExitoso(this.path_logo_ahurus);

      pdf.create(htmlGenerated).toStream(function(err, stream) {
        if (err) {
          console.log(err);
          reject(new Error("No se pudo generar PDF..."))
        };

        resolve(stream);
      });
    });
  }
}

module.exports = Mailer;
