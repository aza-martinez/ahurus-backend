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
		args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
		headless: false,
		ignoreDefaultArgs: ['--disable-extensiontrues'],
	},
	emulateMedia: 'screen',
	pathTemplateExito: 'Master/views/PDF/exito.handlebars',
};
