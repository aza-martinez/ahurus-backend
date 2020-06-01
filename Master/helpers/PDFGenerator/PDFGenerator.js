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
		console.log(template);
		console.log(CONFIG_PDFGENERATOR.launcher);
		const browser = await puppeteer.launch(CONFIG_PDFGENERATOR.launcher);
		const page = await browser.newPage();
		await page.setContent(template);
		await page.emulateMedia(CONFIG_PDFGENERATOR.emulateMedia);
		const PDF = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: {
				left: '0px',
				top: '0px',
				right: '0px',
				bottom: '0px',
			},
		});
		await browser.close();
		return;
	}
}

module.exports = PDFGenerator;
