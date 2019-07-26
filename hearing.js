// set start vars
var hearingactive = false;
var hearingprocess = true;
var api_id;
var api_file;
var sr_file;
var sr_hotword;
var sr_sensitivity;

// process config.json file
loadconfig();

// include colored responses module
const response = require('./response.js');

// include sonus module
const Sonus = require('sonus')

// include Google Cloud text-to-speech module
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient({
  projectId: api_id, //'sara-245106',
  keyFilename: api_file //'resources/apikeys/googlecloud.json'
})

// include sonus settings
const hotwords = [{ file: sr_file, hotword: sr_hotword, sensitivity: sr_sensitivity }]
const language = 'en-US';

// start sonus interface
const sonus = Sonus.init({ hotwords, language, recordProgram: 'arecord' }, client)

module.exports = {
  recognize: function() {
    const sfx = require('./sfx.js');
    sonus.on('hotword', (index, keyword) => {
      sfx.output('hotword');
      response.conlog('hearing', 'hotword <'+keyword+'> detected', 'data');
    })

    sonus.on('partial-result', result => {
      response.conlog('hearing', 'Partial ('+result+')', 'data');
    })

    sonus.on('error', error => {
      response.conlog('hearing', error, 'error');
    })

    sonus.on('final-result', result => {
      if (result) {
        response.conlog('hearing', 'recognized: '+result, 'info');
        sfx.output('command');
        const prompt = require('./prompt.js');
        if (hearingprocess) {
          prompt.write(result+'\n');
        } else {
          prompt.write(result);
        }
      }
    })
  },
//  pause: function() {
//    Sonus.pause(sonus);
//  },
//  resume: function () {
//    Sonus.resume(sonus);
//  },
  cmdexecute: function() {
    if (hearingprocess == false) {
      response.conlog('hearing', 'voice command execution activated', 'status');
      hearingprocess = true;
    } else {
      response.conlog('hearing', 'voice command execution was already activated', 'status');
    }
  },
  cmdtoprompt: function() {
    if (hearingprocess == true) {
      response.conlog('hearing', 'voice command execution deactivated', 'status');
      hearingprocess = false;
    } else {
      response.conlog('hearing', 'voice command execution was already deactivated', 'status');
    }
  },
  listen: function() {
    if (hearingactive == false) {
      response.conlog('hearing', 'voice recognition activated', 'status');
      hearingactive = true;
      Sonus.start(sonus)
      module.exports.recognize();
    } else {
      response.conlog('hearing', 'voice recognition was already activated', 'status');
    }
  },
  stop: function () {
    if (hearingactive == true) {
      hearingactive = false;
      response.conlog('hearing', 'voice recognition deactivated', 'status');
      Sonus.stop();
    } else {
      response.conlog('hearing', 'voice recognition was already deactivated', 'status');
    }
  },
  speechparse: function(sentence) {
    // todo: replace vocal input with known strings (stick -> ZTiK, nine hundred fifteen -> 915)
  },
  status: function () {
    return hearingactive;
  }
}

/*
function myFunc() {
  prompt.write('This is a test');
}
setTimeout(myFunc, 5000); 
*/
function loadconfig() {
  const fs = require('fs')
  const path = './config.json'

  try {
    if (fs.existsSync(path)) {
      var configfile = require('./config.json');
      if (configfile['google cloud'] != null) {
        api_id = configfile['google cloud']['projectid'];
        api_file = configfile['google cloud']['file'];
       } else {
        api_id = 'sara-245106';
        api_file = './resources/apikeys/googlecloud.json';
       }
      if (configfile['hotword']['word'] != null && configfile['hotword']['file'] != null && configfile['hotword']['sensitivity'] != null) {
        sr_hotword = configfile['hotword']['word'];
        sr_file = configfile['hotword']['file'];
        sr_sensitivity = configfile['hotword']['sensitivity'];
      } else {
        sr_hotword = 'Sara';
        sr_file = 'resources/speechrecognition/Sarah.pmdl';
        sr_sensitivity = '0.6';
      }
    }
  } catch(err) {
  }

}