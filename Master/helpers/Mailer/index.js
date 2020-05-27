const nodemailer = require("nodemailer");
const PDFGenerator = require("../PDFGenerator/PDFGenerator");
const path = require("path");
const DateGenerator = require("../DateGenerator");
const hbs = require("nodemailer-express-handlebars");
const configMailer = require("./config");

class Mailer {
  constructor(transferencia, centroCosto) {
    this.centroCosto = centroCosto;
    this.transferencia = transferencia;

    // functions
    this.send = this.send.bind(this);
    this.getTransporter = this.getTransporter.bind(this);
    this.getMailOptions = this.getMailOptions.bind(this);
  }

  async send() {
    // OBTENEMOS DATA GENERAL TRANSFERENCIA
    const { fecha, hora } = DateGenerator.getDateAndHour(
      this.transferencia._doc.timestamp
    );

    const cuentaBeneficiario = this.getBankAccount(
      this.transferencia._doc.cuentaBeneficiario
    );

    const cuentaOrdenante = this.getBankAccount(
      this.transferencia._doc.cuentaOrdenante
    );

    const transferencia = {
      ...this.transferencia._doc,
      ...this.centroCosto,
      fecha,
      hora,
      cuentaOrdenante,
      cuentaBeneficiario,
    };

    //SENDMAIL
    const emailOrdenante = await this.sendMail(null,transferencia);
    const emailBeneficiario = await this.sendMail(
      this.transferencia._doc.emailBeneficiario,
      transferencia,
      'Beneficiario'
    );

    return true;
  }

  async sendMail(email, contextEmail, type) {
    // Creamos el transporter para el mail
    const transporterOrdenante = this.getTransporter();
    //creamos configuración del template HTML
    transporterOrdenante.use("compile", hbs(configMailer.engine));
    const mailOptions = await this.getMailOptions(email, contextEmail, type);
    // ENVIAMOS EMAIL
    const transporte = await transporterOrdenante.sendMail(mailOptions);
    console.log(transporte);
    return;
  }

  /**
   * getTansporter crea un Transporte de NodeMailer para poder
   * enviar el correo
   */
  getTransporter() {
    return nodemailer.createTransport(configMailer.transporter);
  }

  /**
   * getBankAccount
   * @param {String} account
   *
   * Retorna una cuenta bancaria y la formatea
   * obteniendo los ultimos 4 digitos  y rellena el @param {account}
   * con "*"
   */
  getBankAccount(account) {
    const lastCharacters = account.substr(-4);
    account = lastCharacters.padStart(account.length, "*");
    return account;
  }

  /**
   * GetMailOptions nos retorna la configuración para el Mail
   *
   * @param {Object} context
   *
   * En caso de que el campo Exito = true
   * agrega la configuración para adjuntar archivos
   */
  async getMailOptions(emailDestino, context, type) {
    let pdfg;

    const templateMail =
      type === "Beneficiario"
        ? configMailer.templateBeneficiario
        : configMailer.templateError;
    const emailDestinatario = emailDestino || `${this.centroCosto.correo_contacto}`;

    const mailOptions = {
      from: "comprobantes@ahurus.com",
      to: emailDestinatario,
      subject: `Comprobante transferencia - ${this.transferencia.idSTP}`,
      template: templateMail,
      context,
    };

    if (!this.transferencia.descripcionError && type !== "Beneficiario") {
      mailOptions.template = configMailer.templateExito;
      // obtenemos PDF
      pdfg = new PDFGenerator(context);
      const PDF = await pdfg.getPDF();
      mailOptions.attachments = [
        {
          filename: `Recibo de pago - ${this.transferencia.idSTP}`,
          content: PDF,
          contentType: "application/pdf",
        },
      ];
    }

    return mailOptions;
  }
}

module.exports = Mailer;
