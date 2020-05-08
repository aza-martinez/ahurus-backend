const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

class PDFGenerator {

  constructor(transferencia) {
    this.transferencia = transferencia;
    this.getPdfSpeiExitoso = this.getPdfSpeiExitoso.bind(this);
  }


  async getPdfSpeiExitoso() {
    const templateHTML = fs.readFileSync(
      path.join(process.cwd(), "Master/views/PDF/exito.handlebars"),
      "utf-8"
    );

    const template = await handlebars.compile(templateHTML)(this.transferencia);
    const pdfPath = path.join("pdf", "generado.pdf");

    const options = {
      format: "letter",
      headerTemplate: "<p></p>",
      footerTemplate: "<p></p>",
      displayHeaderFooter: false,
      margin: {
        top: "10px",
        bottom: "30px",
      },
      printBackground: true,
    };

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(template);
    await page.emulateMedia('screen');

    const PDF = await page.pdf(options);
    await browser.close();

    return PDF;
  }
}

module.exports = PDFGenerator;
