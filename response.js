// set start vars
var colorsactive = true;
var verbose = false;

// include colors module
const chalk = require('chalk');

module.exports = {
  setverbose: function(arg) {
    if (verbose == false) {
      verbose = true;
      if (arg != 'silent') {
        module.exports.conlog('prompt', 'verbose mode activated', 'status');
      }
      var result = 'I will display \'data\' type responses';
      return result;
    } else {
      module.exports.conlog('prompt', 'verbose mode is already activated', 'status');
      var result = 'I am already displaying \'data\' type responses';
      return result;
    }
  },
  unsetverbose: function() {
    if (verbose == true) {
      verbose = false;
      module.exports.conlog('prompt', 'verbose mode deactivated', 'status');
      var result = 'I will stop displaying \'data\' type responses';
      return result;
    } else {
      module.exports.conlog('prompt', 'verbose mode is already deactivated', 'status');
      var result = 'I have already stopped displaying \'data\' type responses';
      return result;
    }
  },
  getcolors: function() {
    return colorsactive;
  },
  setcolors: function() {
    if (colorsactive == false) {
      colorsactive = true;
      module.exports.conlog('prompt', 'colored responses activated', 'status');
      var result = 'I will display colored responses';
      return result;
    } else {
      module.exports.conlog('prompt', 'colored responses is already activated', 'status');
      var result = 'I am already displaying colored responses';
      return result;
    }
  },
  unsetcolors: function(arg) {
    if (colorsactive == true) {
      colorsactive = false;
      if (arg != 'silent') {
        module.exports.conlog('prompt', 'colored responses deactivated', 'status');
      }
      var result = 'I will no longer display colored responses';
      return result;
    } else {
      module.exports.conlog('prompt', 'colored responses is already deactivated', 'status');
      var result = 'I have already stopped displaying colored responses';
      return result;
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
        text = vocal_stringify(text);
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
      if (type == 'help' || type == 'output') {
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

function vocal_stringify(text) {
  text = String(text);
  text = text.replace(/ztik.nl/gi, 'ZTiK.nl');
  text = text.replace(/ztiknl/gi, 'ZTiKnl');
  text = text.replace(/ztik/gi, 'ZTiK');
  text = text.replace(/s.a.r.a./gi, 'S.A.R.A.');
  text = text.replace(/s.a.r.a/gi, 'S.A.R.A');
  text = text.replace(/sara/gi, 'SARA');
  return text;
}