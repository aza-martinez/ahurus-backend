'use strict';

const mongoose = require('mongoose');
var envJSON = require('../../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
let cnx = '';
let dbDEV = 'development';

class MongooseConncect {
	async connect(nameBD) {
		await mongoose.disconnect();
		await mongoose
			.connect(`mongodb+srv://arendon:20141530@ahurus-lw53s.azure.mongodb.net/ahurus_${nameBD}?retryWrites=true&w=majority`, {
				useNewUrlParser: true,
				useFindAndModify: false,
				useCreateIndex: true,
				useUnifiedTopology: true,
			})
			.then(function() {
				console.log(`connect to DB: ${nameBD}`);
			})
			.catch(function(error) {
				console.log('Error to connect', error);
			});
	}

	async close() {
		await mongoose.connection.close(() => {
			console.log('cnx mongoose closed');
		});
		return true;
	}
}

module.exports = MongooseConncect;
