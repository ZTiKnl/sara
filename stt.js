// set start vars
var hearingactive = false;

// include colored responses module
const response = require('./response.js');

// include sonus module
const Sonus = require('sonus')

// include Google Cloud text-to-speech module
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient({
  projectId: 'sara-245106',
  keyFilename: 'resources/apikeys/googlespeech.json'
})

// include sonus settings
const hotwords = [{ file: 'resources/sonus/Sarah.pmdl', hotword: 'sarah', sensitivity: '0.7' }]
const language = 'en-US';

// start sonus interface
const sonus = Sonus.init({ hotwords, language: language, recordProgram: 'arecord' }, client)

module.exports = {
  recognize: function() {
    sonus.on('hotword', (index, keyword) => {
      response.conlog('hearing', 'audio detected without keyword ('+keyword+')', 'data');
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
      }
    })
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