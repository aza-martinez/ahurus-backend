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
		const template = await handlebars.compile(templateHTML)(this.transferencia);
		console.log(this.transferencia);
		const browser = await puppeteer.launch(CONFIG_PDFGENERATOR.launcher);
		const page = await browser.newPage();
		await page.setContent(template);
		await page.emulateMedia(CONFIG_PDFGENERATOR.emulateMedia);
		const PDF = await page.pdf(CONFIG_PDFGENERATOR.options);
		await browser.close();
		return PDF;
	}
	async getPDFTrans() {
		let plantilla;
		if (this.transferencia.estatus_stp != 'Exito') {
			plantilla = CONFIG_PDFGENERATOR.pathTemplateError;
		} else {
			plantilla = CONFIG_PDFGENERATOR.pathTemplateExito;
		}
		const templateHTML = fs.readFileSync(path.join(process.cwd(), plantilla), 'utf-8');
		const template = await handlebars.compile(templateHTML)({ ...this.transferencia._doc });
		console.log(this.transferencia);
		const browser = await puppeteer.launch(CONFIG_PDFGENERATOR.launcher);
		const page = await browser.newPage();
		await page.setContent(template);
		await page.emulateMedia(CONFIG_PDFGENERATOR.emulateMedia);
		const PDF = await page.pdf(CONFIG_PDFGENERATOR.options);
		await browser.close();
		return PDF;
	}
	async getPDFDispersion() {
		let plantilla;
		if (this.dispersion.estatus_stp != 'Ejecutada') {
			plantilla = CONFIG_PDFGENERATOR.pathTemplateErrorD;
		} else {
			plantilla = CONFIG_PDFGENERATOR.pathTemplateExitoD;
		}
		const templateHTML = fs.readFileSync(path.join(process.cwd(), plantilla), 'utf-8');
		const template = await handlebars.compile(templateHTML)({ ...this.dispersion._doc });
		console.log(this.dispersion);
		const browser = await puppeteer.launch(CONFIG_PDFGENERATOR.launcher);
		const page = await browser.newPage();
		await page.setContent(template);
		await page.emulateMedia(CONFIG_PDFGENERATOR.emulateMedia);
		const PDF = await page.pdf(CONFIG_PDFGENERATOR.options);
		await browser.close();
		return PDF;
	}
}

module.exports = PDFGenerator;
