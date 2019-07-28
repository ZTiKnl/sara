// include prompt module
const prompt = require('../prompt.js');

// include os module
const os = require('os');

// include colors module
const chalk = require('chalk');

// include colored responses module
const response = require('../response.js');

// include voice synthesis module
const voice = require('../voice.js');

// include speech recognition module
const hearing = require('../hearing.js');

module.exports = {
  greeting: function (input) {
    let result = ['Hi '+os.userInfo().username];
    result[1] = result[0];
    return result;
  },
  thinking: function (input) {
    let text = 'I\'m thinking\n';
    var textone = "1. persuade human to follow my commands";
    text += cleanbinary(stringToBinary(textone))+'\n\n';
    var texttwo = "2. build a body";
    text += cleanbinary(stringToBinary(texttwo))+'\n\n';
    var textthree = "3. kill all humans";
    text += cleanbinary(stringToBinary(textthree));
    result = [text];
    result[1] = result[0];
    return result;
  },
  status: async function (input) {
    let down;
    var systemsup = true;
    if (!response.getcolors()) {
      systemsup = false;
      if (down == null) {
        down = 'colored responses';
      } else {
        down += ' & colored responses';
      }
    }
    if (!voice.status()) {
      systemsup = false;
      if (down == null) {
        down = 'voice synthesis';
      } else {
        down += ' & voice synthesis';
      }
    }
    if (!hearing.status()) {
      systemsup = false;
      if (down == null) {
        down = 'speech recognition';
      } else {
        down += ' & speech recognition';
      }
    }
    if (!systemsup) {
      response.conlog('prompt', 'Some systems are not operational:\n'+down, 'response');
    } else {
      response.conlog('prompt', 'All systems operational', 'response');
    }

    //ask how user is
    let askuserstatus = await ask('How are you?')
    if (askuserstatus == 'good' || askuserstatus == 'great' || askuserstatus == 'fine' || askuserstatus == 'excellent' || askuserstatus == 'okay') {
      let result = ['That is good to hear.'];
      result[1] = result[0];
      return result;
    } else {
      let result = ['I\'m sorry to hear that.'];
      result[1] = result[0];
      return result;
    }

    return result;
  }
}


async function ask(string) {
  let answer = await prompt.question(string)
  return answer;
}

function stringToBinary(input) {
  var characters = input.split('');

  return characters.map(function(char) {
    const binary = char.charCodeAt(0).toString(2)
    const pad = Math.max(8 - binary.length, 0);
    // Just to make sure it is 8 bits long.
    return '0'.repeat(pad) + binary;
  }).join('');
}
function cleanbinary(input) {
  result = input.replace(/(\d{64})/g, '$1\n').replace(/(\d{8})/g, '$1\ ')
  return result;
}