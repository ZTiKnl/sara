// set start vars
var voiceactive = false;
var voiceoutput;

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');

const sfx = require('play-sound')(opts = {player: "aplay"})

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
  synthesize: async function(sentence) {
    if (voiceactive == true) {
      sentence = module.exports.vocalize(sentence);
      const client = new textToSpeech.TextToSpeechClient({
        projectId: 'sara-245106',
        keyFilename: 'resources/apikeys/googlecloud.json'
      })
     
      // Construct the request
      const request = {
        input: {text: sentence},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: 'en-US', name: 'en-GB-Wavenet-C', ssmlGender: 'FEMALE'},
        // Select the type of audio encoding
        audioConfig: {audioEncoding: 'LINEAR16'},
      };
     
      // Performs the Text-to-Speech request
      const [result] = await client.synthesizeSpeech(request);
      // Write the binary audio content to a local file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile('resources/voice/output.wav', result.audioContent, 'binary');

      voiceoutput = sfx.play('./resources/voice/output.wav', function(err){
        if (err.message != undefined) {
          response.conlog('voice', 'Couldn\'t synthesize voice: '+err.message, 'error');
          return
        }
        voiceoutput = null;
      })
    }
  },
  vocalize: function(sentence) {
    // todo: replace input with vocal corrections (ztik -> stick, S.A.R.A. -> sarah)
    sentence = sentence.replace(/ZTiK.nl/gi, "Stick N L");
    sentence = sentence.replace(/ZTiKnl/gi, "Stick N L");
    sentence = sentence.replace(/ZTiK/gi, "Stick");
    sentence = sentence.replace(/SARA/gi, "Sarah");
    sentence = sentence.replace(/S.A.R.A./gi, "Sarah");
    sentence = sentence.replace(/S.A.R.A/gi, "Sarah");
    return sentence;
  },
  silence: function() {
    if (voiceoutput != null) {
      voiceoutput.kill();
      response.conlog('voice', 'Stopped talking', 'info');
    } else {
      response.conlog('voice', 'I wasn\'t talking (anymore)', 'info');
    }
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