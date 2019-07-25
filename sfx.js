// set start vars
var sfxactive = true;
var sfxoutput;

// include sfx module (default player: aplay)
const sfx = require('play-sound')(opts = {player: "aplay"})

// include colored responses module
const response = require('./response.js');


const hearing = require('./hearing.js')

module.exports = {
  start: function() {
    if (sfxactive == false) {
      response.conlog('sfx', 'sound effects activated', 'status');
      sfxactive = true;
    } else {
      response.conlog('sfx', 'sound effects are already activated', 'status');
    }
  },
  output: async function(effect) {
//    hearing.pause();
    if (sfxactive == true) {
      var file;
      if (effect == 'startup') {
        file = './resources/sfx/startup.wav';
      } else if (effect == 'shutdown') {
        file = './resources/sfx/shutdown.wav';
      } else if (effect == 'hotword') {
        file = './resources/sfx/hotword.wav';
      } else if (effect == 'commandsfx') {
        file = './resources/sfx/command.wav';
      } else if (effect == 'voice') {
        file = './resources/voice/output.wav';
      }
      
      sfxoutput = sfx.play(file, function(err){
        if (err) {
          if (!sfxoutput.killed) {
            response.conlog('voice', 'Couldn\'t synthesize voice: already speaking', 'error');
          } else {
            if (effect == 'startupsfx') {
            } else if (effect == 'shutdownsfx') {
              response.conlog('sfx', 'Couldn\'t play shutdown sfx', 'error');
            } else if (effect == 'hotwordsfx') {
              response.conlog('sfx', 'Couldn\'t play hotword sfx', 'error');
            } else if (effect == 'commandsfx') {
              response.conlog('sfx', 'Couldn\'t play command sfx', 'error');
            } else if (effect == 'voice') {
              if (!sfxoutput.killed) {
                response.conlog('sfx', 'Couldn\'t synthesize voice', 'error');
              } else {
                response.conlog('sfx', 'Stopped voice synthesis', 'info');
              }
            }
          }
        }
//        hearing.resume();
        sfxoutput = null;
        return;
      })
    }
  },
  quiet: function() {
    if (sfxoutput != null) { 
      sfxoutput.kill();
    } else {
      response.conlog('voice', 'I wasn\'t talking (anymore)', 'info');
    }
    return;
  },
  stop: function() {
    if (sfxactive == true) {
      response.conlog('sfx', 'sound effects deactivated', 'status');
      sfxactive = false;
    } else {
      response.conlog('sfx', 'sound effects are already deactivated', 'status');
    }
  },
  status: function() {
    return sfxactive;
  }
}