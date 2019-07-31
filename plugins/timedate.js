// include date-and-time module
const date = require('date-and-time');

// include weeknumber module
const weeknr = require('weeknumber');

module.exports = {
  timenow: function () {
    var now = new Date();
    let result = [date.format(now, 'HH:mm')];
    result[1] = '<say-as interpret-as="time" format="hm24">'+result[0]+'</say-as>';
    return result;
  },
  datenow: function () {
    var now = new Date();
    let result = [date.format(now, 'DD/MM/YYYY')];
    result[1] = '<say-as interpret-as="time" format="ddmmyyyy">'+result[0]+'</say-as>';
    return result;
  },
  day: function () {
    var now = new Date();
    let result = [date.format(now, 'dddd')];
    result[1] = result[0];
    return result;
  },
  month: function () {
    var now = new Date();
    let result = [date.format(now, 'MMMM')];
    result[1] = result[0];
    return result;
  },
  year: function () {
    var now = new Date();
    let result = [date.format(now, 'YYYY')];
    result[1] = result[0];
    return result;
  },
  weeknr: function () {
    var now = new Date();
    let result = [weeknr.weekNumber(now)];
    result[1] = result[0];
    return result;
  }
}
