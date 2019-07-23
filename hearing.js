// set start vars
var hearingactive = false;
var hearingprocess = true;

// include colored responses module
const response = require('./response.js');

const sfx = require('play-sound')(opts = {})

// include sonus module
const Sonus = require('sonus')

// include Google Cloud text-to-speech module
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient({
  projectId: 'sara-245106',
  keyFilename: 'resources/apikeys/googlecloud.json'
})

// include sonus settings
const hotwords = [{ file: 'resources/sonus/Sarah.pmdl', hotword: 'sarah', sensitivity: '0.6' }]
const language = 'en-US';

// start sonus interface
const sonus = Sonus.init({ hotwords, language, recordProgram: 'arecord' }, client)

module.exports = {
  recognize: function() {
    sonus.on('hotword', (index, keyword) => {
      sfx.play('./resources/sfx/normal.wav', function(err){
        if (err) {
          response.conlog('hearing', 'Couldn\'t play hotword sfx: '+err.message, 'error');
        }
      })
      response.conlog('hearing', '<'+keyword+'>', 'data');
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
        const prompt = require('./prompt.js');
        if (hearingprocess) {
          prompt.write(result+'\n');
        } else {
          prompt.write(result);
        }
      }
    })
  },
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