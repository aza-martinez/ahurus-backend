"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 80;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
//MONGO ATLAS
//mongoose.connect('mongodb+srv://itcom-ahurus:Ahurus2019@itcom-bulmn.mongodb.net/ahurus_general?retryWrites=true&w=majority' , { useUnifiedTopology: true })
//COSMOS AZURE
//mongoose.connect('mongodb://ahurusdb:We4Xb31HAHaZQQ1ct78jBcp470WPNfoBEG6DH6yeWq3I2UfAb5aWSj5g2A7MJE2ar0ILrBKZA0GCwTok9AD12Q%3D%3D@ahurusdb.documents.azure.com:10255/?ssl=true' , { useUnifiedTopology: true })
//COSMOS LOCAL
/**mongoose
  .connect(
    "mongodb+srv://arendon:20141530@ahurus-lw53s.azure.mongodb.net/ahurus_probando_create?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Conexión Con Mongo Atlas Establecida");

    // Crear servidor y ponerme a escuchar peticiones HTTP
    app.listen(port, () => {
      console.log("Servidor corriendo en http://localhost:" + port);
    });
  }); */

      // Crear servidor y ponerme a escuchar peticiones HTTP
      app.listen(port, () => {
        console.log("Servidor corriendo en http://localhost:" + port );
      });