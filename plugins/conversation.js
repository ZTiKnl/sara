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
const stt = require('../stt.js');

module.exports = {
  greeting: function (input) {
    let result = 'Hi '+os.userInfo().username;
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
    if (!stt.status()) {
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
    let result = await ask('How are you?')
    if (result == 'good' || result == 'great' || result == 'fine' || result == 'excellent' || result == 'okay') {
      let result = 'thats good to hear.';
      return result;
    } else {
      let result = 'thats sucks...';
      return result;
    }

    return result;
  }
}

async function ask(string) {
  let answer = await prompt.question(string)
  return answer;
}