const moment = require("moment");

class DateGenerator {
  constructor() {
    this.region = "America/Mexico_City";

    this.getDate = this.getDate.bind(this);
    this.getHour = this.getHour.bind(this);
    this.getDateAndHour = this.getDateAndHour.bind(this);
  }

  getDate(date) {
    const $date = moment().tz(this.region).utc(date).format("l");
    return $date;
  }

  getHour(date) {
    const $date = moment().tz(this.region).utc(date).format("LT");
    return $date;
  }

  getDateAndHour(date) {
    const fecha = this.getDate(date);
    const hora = this.getHour(date);
    return { fecha, hora };
  }
}

const dateGenerator = new DateGenerator();
module.exports = dateGenerator;
