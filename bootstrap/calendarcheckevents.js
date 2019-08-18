// include colored responses module
const response = require('../response.js');
var daemon;
module.exports = {
  start: function() {
    response.conlog('bootstrap', 'calendar event checker activated', 'status');
    daemon = setInterval(calsync,10000);
  },
  sync: calsync,
  stop: function() {
    response.conlog('bootstrap', 'calendar event checker deactivated', 'status');
    clearInterval(daemon);
  }
}

function calsync() {
  response.conlog('bootstrap', 'calendar event checker triggered', 'info');
}