const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const CONFIG_PDFGENERATOR = require('./config');
const DateGenerator = require("../DateGenerator");

const TIPOS_CUENTAS = [
	{ clave: 3, descripcion: 'TDD' },
	{ clave: 40, descripcion: 'Clabe Inter.' }
];


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

		const browser = await puppeteer.launch(CONFIG_PDFGENERATOR.launcher);
		const page = await browser.newPage();
		await page.setContent(template);
		await page.emulateMedia(CONFIG_PDFGENERATOR.emulateMedia);
		const PDF = await page.pdf(CONFIG_PDFGENERATOR.options);
		await browser.close();
		return PDF;
	}
	async getPDFDispersion() {
		const plantilla = CONFIG_PDFGENERATOR.pathTemplateExitoD;
		const templateHTML = fs.readFileSync(path.join(process.cwd(), plantilla), 'utf-8');
		const { fecha } = DateGenerator.getDateAndHour(
			this.transferencia.fechaSubida
		  );

		// Creamos helper en Handlebars para poder realizar
		// suma en la plantilla (sum)
		handlebars.registerHelper("sum", (value) => {
			return parseInt(value) + 1
		});

		handlebars.registerHelper("GetTipoCuenta", (value) => {
			if (value == 3) return "TDD";
			if (value == 40) return "Clabe Inter"
		})

		const Total = this.transferencia.idTransferencia.reduce((accumulator, current) => 
			parseFloat(parseFloat(accumulator) + parseFloat(current.monto)).toFixed(2) , 0
		);

		const template = await handlebars.compile(templateHTML)({
			...this.transferencia,
			tiposCuentas: TIPOS_CUENTAS,
			Total,
			fecha
		});

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
