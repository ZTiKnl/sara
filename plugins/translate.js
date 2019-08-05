var api_id;
var api_file;

// process config.json file
loadconfig();

const {Translate} = require('@google-cloud/translate');

module.exports = {
  lang: async function (input) {

    const translate = new Translate({
      projectId: api_id,
      keyFilename: api_file
    });
   
    var text = input[2];

    var target;
    if (input[1].toLowerCase() == 'dutch') {
      target = 'nl';
    } else if (input[1].toLowerCase() == 'english') {
      target = 'en';
    } else if (input[1].toLowerCase() == 'french') {
      target = 'fr';
    } else if (input[1].toLowerCase() == 'german') {
      target = 'de';
    }
   
    const [translation] = await translate.translate(text, target);

    let result = [translation];
    result[1] = translation;
    result[2] = input[1];
    return result;
  }
}

function loadconfig() {
  const fs = require('fs');
  try {
    if (fs.existsSync('./config.json')) {
      var configfile = require('../config.json');
      if (configfile['google cloud'] != null) {
        api_id = configfile['google cloud']['projectid'];
        api_file = configfile['google cloud']['file'];
      } else {
        api_id = 'sara-245106';
        api_file = './resources/apikeys/googlecloud.json';
      }
    }
  } catch(err) {
  }
}