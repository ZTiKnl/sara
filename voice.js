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
  start: async function() {
    if (voiceactive == false) {
      response.conlog('voice', 'speech synthesis activated', 'info');
      voiceactive = true;
      var result = 'I am able to speak now';
      return result;
    } else {
      response.conlog('voice', 'speech synthesis was already activated', 'info');
      var result = 'I am already able to speak';
      return result;
    }
  },
  list: async function(language) {
    if(language) {
      if (language == 'french') {
        language = 'fr';
      }
      if (language == 'dutch') {
        language = 'nl';
      }
      if (language == 'german') {
        language = 'de';
      }
      if (language == 'english') {
        language = 'en';
      }
    } else {
      var language = vo_language;
    }
    const client = new textToSpeech.TextToSpeechClient({
      projectId: api_id,
      keyFilename: api_file
    })
    const result = await client.listVoices({'languageCode': language});
    console.log(result[0]['voices']);
    console.log(result[0]['voices'].length)
    if (result[0]['voices'].length < 1) {
      var rslt = 'There are no voices available';
    } else {
      var rslt = 'There are '+result[0]['voices'].length+' voices available';
      var i = 0;
      while (i < result[0]['voices'].length) {
        response.conlog('voice', result[0]['voices'][i]['languageCodes']+':\n\t'+result[0]['voices'][i]['ssmlGender']+'\n\tName: '+result[0]['voices'][i]['name']+'\n\tSample rate: '+result[0]['voices'][i]['naturalSampleRateHertz']+'\n', 'output');
        i++;
      }      
    }
    return rslt;
  },
  synthesize: async function(sentence, language) {
    if (language) {
      if (language == 'french') {
        vo_language = 'fr-FR';
        if (vo_gender == 'FEMALE') {
          vo_voice = 'fr-FR-Wavenet-C';
        } else {
          vo_voice = 'fr-FR-Wavenet-D';
        }
      }
      if (language == 'dutch') {
        vo_language = 'nl-NL';
        if (vo_gender == 'FEMALE') {
          vo_voice = 'nl-NL-Wavenet-D';
        } else {
          vo_voice = 'nl-NL-Wavenet-C';
        }
      }
      if (language == 'german') {
        vo_language = 'de-DE';
        if (vo_gender == 'FEMALE') {
          vo_voice = 'de-DE-Wavenet-C';
        } else {
          vo_voice = 'de-DE-Wavenet-B';
        }
      }
      if (language == 'english') {
        vo_language = 'en-GB';
        if (vo_gender == 'FEMALE') {
          vo_voice = 'en-GB-Wavenet-C';
        } else {
          vo_voice = 'en-GB-Wavenet-B';
        }
      }
    }

    if (voiceactive == true) {
      sentence = module.exports.vocalize(String(sentence));
      const client = new textToSpeech.TextToSpeechClient({
        projectId: api_id,
        keyFilename: api_file
      })
     
      const request = {
        input: {ssml: sentence},
        voice: {languageCode: vo_language, name: vo_voice, ssmlGender: vo_gender},
        audioConfig: {audioEncoding: 'LINEAR16'},
      };
     
      const [result] = await client.synthesizeSpeech(request);
      const writeFile = util.promisify(fs.writeFile);
      await writeFile('resources/voice/output.wav', result.audioContent, 'binary');
      sfx.output('voice');
      
      if (language) {
        loadconfig();
      }
      return;
    }
  },
  vocalize: function(sentence) {
    sentence = sentence.replace(/\n/gi, "<break time=\'750ms\'/>\n");
    sentence = sentence.replace(/,/gi, "<break time=\'500ms\'/>\n");
    sentence = sentence.replace(/:/gi, "<break time=\'500ms\'/>\n");
    sentence = sentence.replace(/;/gi, "<break time=\'500ms\'/>\n");
    sentence = sentence.replace(/\(/gi, "<break time=\'500ms\'/>\n");
    sentence = sentence.replace(/\)/gi, "<break time=\'500ms\'/>\n");
    sentence = sentence.replace(/ZTiK.nl/gi, "Stick N L");
    sentence = sentence.replace(/ZTiKnl/gi, "Stick N L");
    sentence = sentence.replace(/ZTiK/gi, "Stick");
    sentence = sentence.replace(/SARA/gi, "Sarah");
    sentence = sentence.replace(/S.A.R.A./gi, "Sarah");
    sentence = sentence.replace(/S.A.R.A/gi, "Sarah");
    sentence = '<speak><break time=\'250ms\'/>'+sentence+'</speak>';
    return sentence;
  },
  silence: async function() {
    await sfx.quiet();
    var result = '...';
    return result;
  },
  stop: async function() {
    if (voiceactive == true) {
      response.conlog('voice', 'speech synthesis deactivated', 'info');
      voiceactive = false;
      var result = 'I am no longer able to speak';
      return result;
    } else {
      response.conlog('voice', 'speech synthesis was already deactivated', 'info');
      var result = 'I am already unable to speak';
      return result;
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