// set start vars
var sfxactive = false;
var sfxoutput;
var sfx_hotword
var sfx_command;
var sfx_startup;
var sfx_shutdown;

// process config.json file
loadconfig();

// include sfx module (default player: aplay)
const sfx = require('play-sound')(opts = {player: "aplay"})

// include colored responses module
const response = require('./response.js');


const hearing = require('./hearing.js')

module.exports = {
  start: async function() {
    if (sfxactive == false) {
      response.conlog('sfx', 'sound effects activated', 'status');
      sfxactive = true;
      result = 'I am now able to emulate sound effects';
      return result;
    } else {
      response.conlog('sfx', 'sound effects are already activated', 'status');
      result = 'I am already able to emulate sound effects';
      return result;
    }
  },
  output: async function(effect) {
//    hearing.pause();
    if (sfxactive == true || effect == 'voice') {
      var file;
      if (effect == 'startup') {
        file = sfx_startup;
      } else if (effect == 'shutdown') {
        file = sfx_shutdown;
      } else if (effect == 'hotword') {
        file = sfx_hotword;
      } else if (effect == 'command') {
        file = sfx_command;
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
  quiet: async function() {
    if (sfxoutput != null) { 
      await sfxoutput.kill();
    } else {
      response.conlog('voice', 'I wasn\'t talking (anymore)', 'info');
    }
    result = '...';
    return result;
  },
  stop: async function() {
    if (sfxactive == true) {
      response.conlog('sfx', 'sound effects deactivated', 'status');
      sfxactive = false;
      result = 'I am no longer able to emulate sound effects';
      return result;
    } else {
      response.conlog('sfx', 'sound effects are already deactivated', 'status');
      result = 'I am already not able to emulate sound effects';
      return result;
    }
  },
  status: function() {
    return sfxactive;
  }
}

function loadconfig() {
  const fs = require('fs')
  const path = './config.json'

  try {
    if (fs.existsSync(path)) {
      var configfile = require('./config.json');
      if (configfile['sfx']['hotword'] != null) {
        sfx_hotword = configfile['sfx']['hotword'];
      } else {
        sfx_hotword = './resources/sfx/hotword.wav';
      }
      if (configfile['sfx']['command'] != null) {
        sfx_command = configfile['sfx']['command'];
      } else {
        sfx_command = './resources/sfx/command.wav';
      }
      if (configfile['sfx']['startup'] != null) {
        sfx_startup = configfile['sfx']['startup'];
      } else {
        sfx_startup = './resources/sfx/startup.wav';
      }
      if (configfile['sfx']['shutdown'] != null) {
        sfx_shutdown = configfile['sfx']['shutdown'];
      } else {
        sfx_shutdown = './resources/sfx/shutdown.wav';
      }

    }
  } catch(err) {
  }

}