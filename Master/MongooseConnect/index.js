"use strict";

const mongoose = require("mongoose");
var envJSON = require("../../env.variables.json");
var node_env = process.env.NODE_ENV || "development";
let cnx = "";
let dbDEV = "development";
process.setMaxListeners(0);

class MongooseConncect {
  async connect(nameBD) {
    await mongoose.connection.close();
    await mongoose
      .connect(
        `mongodb+srv://ahurusmdb:EcQR7P9uFec4RS@ahuruscluster-5ryx6.azure.mongodb.net/ahurus_${nameBD}?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
          useUnifiedTopology: true,
        }
      )
      .then(function () {})
      .catch(function (error) {});
  }

  async close() {
    await mongoose.connection.close(() => {});
    return true;
  }
}

module.exports = MongooseConncect;
