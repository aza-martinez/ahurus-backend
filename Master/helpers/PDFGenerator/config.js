module.exports = {
	options: {
		format: 'letter',
		headerTemplate: '<p></p>',
		footerTemplate: '<p></p>',
		margin: {
			top: '10px',
			bottom: '30px',
		},
		printBackground: true,
	},
	launcher: {
		args: ['--no-sandbox', '--disable-setuid-sandbox' /* , '--disable-dev-shm-usage', '--single-process', '--disable-extensions' */],
		headless: false,
		//ignoreDefaultArgs: ['--disable-extensiontrues'],
	},
	emulateMedia: 'screen',
	pathTemplateExito: 'Master/views/PDF/exito.handlebars',
};
