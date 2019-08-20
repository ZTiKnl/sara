// include colored responses module
const response = require('../response.js');

var daemon;
var bootstrapactive = false;

module.exports = {
  start: function() {
    if (!bootstrapactive) {
      response.conlog('bootstrap', 'calendar event checker activated', 'status');
      daemon = setInterval(calsync,10000);
      bootstrapactive = true;
    } else {
      response.conlog('bootstrap', 'calendar event checker was already activated', 'status');
    }
  },
  stop: function() {
    if (bootstrapactive) {
      response.conlog('bootstrap', 'calendar event checker deactivated', 'status');
      clearInterval(daemon);
      bootstrapactive = false;
    } else {
      response.conlog('bootstrap', 'calendar event checker was already activated', 'status');
    }
  },
  status: function() {
    return bootstrapactive;
  }
}

function calsync() {
  response.conlog('bootstrap', 'calendar event checker triggered', 'info');
}