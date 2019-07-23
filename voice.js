// set start vars
var voiceactive = false;

// include say module
const say = require('say');

// include colored responses module
const response = require('./response.js');

module.exports = {
  start: function() {
    if (voiceactive == false) {
      response.conlog('voice', 'speech synthesis activated', 'status');
      voiceactive = true;
    } else {
      response.conlog('voice', 'speech synthesis was already activated', 'status');
    }
  },
  synthesize: function(sentence) {
    if (voiceactive == true) {
      say.speak(sentence, (err) => {
        if (err) {
          response.conlog('voice.synthesize', err.message, 'error');
          return
        }
        response.conlog('voice.synthesize', sentence, 'response');
        return
      });
    }
  },
  vocalize: function(sentence) {
    // todo: replace input with vocal corrections (ztik -> stick, S.A.R.A. -> sarah)
  },
  silence: function() {
    say.stop(function (err) {
      if (err) {
        console.log('error: '+err.message)
      }
      console.log('stopped talking')
    });
  },
  stop: function() {
    if (voiceactive == true) {
      response.conlog('voice', 'speech synthesis deactivated', 'status');
      voiceactive = false;
    } else {
      response.conlog('voice', 'speech synthesis was already deactivated', 'status');
    }
  },
  status: function() {
    return voiceactive;
  }
}