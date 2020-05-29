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
		headless: true,
	},
	emulateMedia: 'screen',
	pathTemplateExito: 'Master/views/PDF/exito.handlebars',
};
