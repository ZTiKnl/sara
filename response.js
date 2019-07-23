// set start vars
var colorsactive = true;
var verbose = false;

// include colors module
const chalk = require('chalk');

module.exports = {
  setverbose: function() {
    if (verbose == false) {
      verbose = true;
    } else {
      module.exports.conlog('prompt', 'verbose mode is already activated', 'status')
    }
  },
  unsetverbose: function() {
    if (verbose == true) {
      verbose = false;
    } else {
      module.exports.conlog('prompt', 'verbose mode is already deactivated', 'status')
    }
  },
  getcolors: function() {
    return colorsactive;
  },
  setcolors: function() {
    if (colorsactive == false) {
      colorsactive = true;
    } else {
      module.exports.conlog('prompt', 'colored responses is already activated', 'status')
    }
  },
  unsetcolors: function() {
    if (colorsactive == true) {
      colorsactive = false;
    } else {
      module.exports.conlog('prompt', 'colored responses is already deactivated', 'status')
    }
  },
  conlog: function(module, text, type) {
    if (colorsactive) {
      if (verbose) {
        if (type == 'data') {
          console.log(chalk.gray.bgBlack.bold('('+module+' / '+type+') '+text));
        } else if (type == 'warn') {
          console.log(chalk.black.bgYellow.bold('('+module+' / '+type+') '+text));
        }
      }
      if (type == 'command') {
        console.log(chalk.blue.bgWhiteBright.bold('('+module+' / '+type+') '+text));
      }
      if (type == 'options') {
        console.log(chalk.yellow.bgBlack.bold('('+module+' / '+type+') '+text));
      }
      if (type == 'response') {
        const voice = require('./voice.js');
        voice.synthesize(text);
        console.log(chalk.cyan.bgBlack.bold('('+module+' / '+type+') '+text));
      }
      if (type == 'prompt') {
        console.log(chalk.magenta.bgBlack.bold('('+module+' / '+type+') '+text));
      }
      if (type == 'status') {
        console.log(chalk.green.bgBlack.bold('('+module+' / '+type+') '+text));
      }
      if (type == 'info') {
        console.log(chalk.yellow.bgBlack.bold('('+module+' / '+type+') '+text));
      }
      if (type == 'help') {
        console.log(chalk.yellow.bgBlack.bold(text));
      }
      if (type == 'error') {
        console.log(chalk.yellow.bgRed.bold('('+module+' / '+type+') '+text));
      }
    } else {
      if (verbose) {
        console.log('('+module+' / '+type+') '+text);
      } else {
        if (type != 'data') {
          console.log('('+module+' / '+type+') '+text);
        }
      }
    }
  }
}