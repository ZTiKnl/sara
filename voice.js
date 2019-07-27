// set start vars
var voiceactive = false;
var api_id;
var api_file;
var vo_language;
var vo_voice;
var vo_gender;

// process config.json file
loadconfig();

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');

const sfx = require('./sfx.js')

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
        projectId: api_id, //'sara-245106',
        keyFilename: api_file //'resources/apikeys/googlecloud.json'
      })
     
      // Construct the request
      const request = {
        input: {text: sentence},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: vo_language, name: vo_voice, ssmlGender: vo_gender},
        // Select the type of audio encoding
        audioConfig: {audioEncoding: 'LINEAR16'},
      };
     
      // Performs the Text-to-Speech request
      const [result] = await client.synthesizeSpeech(request);
      // Write the binary audio content to a local file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile('resources/voice/output.wav', result.audioContent, 'binary');
      sfx.output('voice');
      return;
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
    sfx.quiet();
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

      if (configfile['voiceoptions']['language'] != null) {
        vo_language = configfile['voiceoptions']['language'];
      } else {
        vo_language = 'en-US';
      }
      if (configfile['voiceoptions']['voice'] != null) {
        vo_voice = configfile['voiceoptions']['voice'];
      } else {
        vo_voice = 'en-GB-Wavenet-C';
      }
      if (configfile['voiceoptions']['gender'] != null) {
        vo_gender = configfile['voiceoptions']['gender'];
      } else {
        vo_gender = 'FEMALE';
      }
    }
  } catch(err) {
  }

}