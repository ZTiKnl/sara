// set start vars
var sttactive = false;

// include colored responses module
const response = require('./response.js');

// include readline module
const readline = require('readline');

// include sonus module
const Sonus = require('sonus')

// include Google Cloud text-to-speech module
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient({
  projectId: 'sara-245106',
  keyFilename: 'resources/apikeys/googlespeech.json'
})

const hotwords = [{ file: 'resources/sonus/Sarah.pmdl', hotword: 'sarah', sensitivity: '0.7' }]
const language = 'en-US';

const sonus = Sonus.init({ hotwords, language: language, recordProgram: 'arecord' }, client)

module.exports = {
  recognize: function() {
    sonus.on('hotword', (index, keyword) => {
      response.conlog('stt', 'audio detected without keyword ('+keyword+')', 'data');
    })

    sonus.on('partial-result', result => {
      response.conlog('stt', 'Partial ('+result+')', 'data');
    })

    sonus.on('error', error => {
      response.conlog('stt', error, 'error');
    })

    sonus.on('final-result', result => {
      if (result) {
        response.conlog('stt', 'recognized: '+result, 'info');
      }
    })
  },
  listen: function() {
    if (sttactive == false) {
      response.conlog('stt', 'voice recognition activated', 'status');
      sttactive = true;
      Sonus.start(sonus)
      module.exports.recognize();
    } else {
      response.conlog('stt', 'voice recognition was already activated', 'status');
    }
  },
  stop: function () {
    if (sttactive == true) {
      sttactive = false;
      response.conlog('stt', 'voice recognition deactivated', 'status');
      Sonus.stop();
    } else {
      response.conlog('stt', 'voice recognition was already deactivated', 'status');
    }
  },
  status: function () {
    return sttactive;
  }
}