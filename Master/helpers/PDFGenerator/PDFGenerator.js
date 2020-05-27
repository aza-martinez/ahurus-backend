const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const CONFIG_PDFGENERATOR = require('./config');

class PDFGenerator {
	constructor(transferencia) {
		this.transferencia = transferencia;
		this.getPDF = this.getPDF.bind(this);
	}

	async getPDF() {
		const templateHTML = fs.readFileSync(path.join(process.cwd(), CONFIG_PDFGENERATOR.pathTemplateExito), 'utf-8');

<<<<<<< HEAD
    const template = await handlebars.compile(templateHTML)(this.transferencia);
    console.log(CONFIG_PDFGENERATOR.launcher);
    const browser = await puppeteer.launch(CONFIG_PDFGENERATOR.launcher);
    const page = await browser.newPage();
    await page.setContent(template);
    await page.emulateMedia(CONFIG_PDFGENERATOR.emulateMedia);
    const PDF = await page.pdf(CONFIG_PDFGENERATOR.options);
    console.log(PDF);
    await browser.close();
=======
		const template = await handlebars.compile(templateHTML)(this.transferencia);
		const browser = await puppeteer.launch(CONFIG_PDFGENERATOR.launcher);
		const page = await browser.newPage();
		await page.setContent(template);
		await page.emulateMedia(CONFIG_PDFGENERATOR.emulateMedia);
		const PDF = await page.pdf(CONFIG_PDFGENERATOR.options);
		console.log(PDF);
		await browser.close();
>>>>>>> 6dd44535e84f4a5e8862c6922295d0b247c4669a

		return PDF;
	}
}

module.exports = PDFGenerator;
