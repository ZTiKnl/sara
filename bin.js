// set start vars
var speechsynthesisstart = true;
var speechrecognitionstart = true;
var colorstart = true;
var verbose = false;

// process command line arguments
argumental();

// include screenwipe module
const screenhist = require('./screenhist.js');
screenhist.wipe();

// include colored responses module
const response = require('./response.js');
if (!colorstart) {
  response.unsetcolors();
}
if (verbose) {
  response.setverbose();
}
// include help function module
const help = require('./help.js');

// include prompt module
const prompt = require('./prompt.js');

// include voice synthesis module
const voice = require('./voice.js');

// include speech recognition module
const stt = require('./stt.js');

// start prompt
prompt.start();
prompt.setCompletion(['help', 'add', 'edit', 'start', 'stop', 'listening', 'voice', 'silence', 'verbose', 'colors']);
if (verbose) { 
    response.conlog('prompt', 'verbose mode activated', 'status');
}
if (colorstart) { 
  response.conlog('response', 'colored responses activated', 'status');
} else {
  response.conlog('response', 'colored responses not activated: --no-colors flag', 'status');
}
if (typeof help !== undefined) { 
    response.conlog('help', 'helper function activated', 'status');
}

// start voice
if (speechsynthesisstart) {
  voice.start();
} else {
  response.conlog('voice', 'speech synthesis not activated: --no-voice flag', 'status');
}

// start speech recognition, keyword: sara
if (speechrecognitionstart) {
  stt.listen();
} else {
  response.conlog('stt', 'speech recognition not activated: --no-speech-recognition flag', 'status');
}

/*
function myFunc() {
  prompt.write('This is a test');
}
setTimeout(myFunc, 5000); 
*/

function argumental() {
  process.argv.forEach(function (val, index, array) {
    val = val.trim();
    if (val.toLowerCase() == '--verbose' || val == '-v') {
      verbose = true;
    }
    if (val.toLowerCase() == '--version' || val == '-V') {
      const { version } = require('./package.json');
      console.log('(--version)');
      console.log('');
      console.log(version);
      process.exit();
    }
    if (val.toLowerCase() == '--no-colors' || val == '-nc') {
      colorstart = false;
    }
    if (val.toLowerCase() == '--no-voice' || val == '-nv') {
      speechsynthesisstart = false;
    }
    if (val.toLowerCase() == '--no-speech-recognition' || val == '-nsr') {
      speechrecognitionstart = false;
    }
    if (val.toLowerCase() == '--help' || val == '-h') {
      console.log('(--help)');
      console.log('');
      console.log('Usage: sara [OPTIONS]');
      console.log('');
      console.log('arguments:');
      console.log('\t-h, --help\tDisplay this help and exits');
      console.log('\t-nc, --no-colors\tDo not activate colored responses on start');
      console.log('\t-nsr, --no-speech-recognition\tDo not activate speech recognition on start');
      console.log('\t-nv, --no-voice\tDo not activate speech synthesis on start');
      console.log('\t-v, --verbose\tDisplay additional information, noisy (debug data)');
      console.log('\t-V, --version\tDisplay version number and exits');
      console.log('');
      console.log('Internal help function is available by typing \'help\' in SARAs prompt.');
      process.exit();
    }
  });
}