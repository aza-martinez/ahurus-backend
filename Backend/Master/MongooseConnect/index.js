'use strict';

const mongoose = require("mongoose");

class MongooseConncect {
    async connect(nameBD) {
        await mongoose.connect(`mongodb+srv://arendon:20141530@ahurus-lw53s.azure.mongodb.net/ahurus_${nameBD}?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
          useUnifiedTopology: true
        }).then(function() {
            console.log(`Conectado a BD ${nameBD}`);
        }).catch(function(error) {
            console.log('Error to connect', error);
        });
    }

   async close() {
       await mongoose.connection.close();
       console.log('cnx cerrada');
    }
}

module.exports = MongooseConncect;

