// set start vars
var speechsynthesisstart = true;
var speechrecognitionstart = true;
var visionstart = true;
var sfxstart = true;
var colorstart = true;
var bootstrapstart = true;
var verbose = false;
var configfilefound = false;

// process config.json file
loadconfig();

// process command line arguments
argumental();

// include screenwipe module
const screenhist = require('./screenhist.js');
screenhist.wipe();

// include colored responses module
const response = require('./response.js');
if (!colorstart) {
  response.unsetcolors('silent');
}
if (verbose) {
  response.setverbose('silent');
}
// include help function module
const help = require('./help.js');

// include prompt module
const prompt = require('./prompt.js');

// include sfx module
const sfx = require('./sfx.js');

// include voice synthesis module
const voice = require('./voice.js');

// include speech recognition module
const hearing = require('./hearing.js');

// include vision module
const vision = require('./vision.js');

// include bootstrap module
const bootstrap = require('./bootstrap.js');

// start prompt
prompt.start();
prompt.setCompletion(['help', 'add', 'edit', 'list', 'start', 'stop', 'listening', 'hearing', 'voice', 'voices', 'talking', 'silence', 'quiet', 'vision', 'watching', 'verbose', 'colors', 'command', 'execution', 'parsing', 'sound', 'effects', 'sfx']);
if (configfilefound) {
  response.conlog('prompt', 'loading settings from configuration file (./config.json)', 'status');
} else {
  response.conlog('prompt', 'no configuration file found (./config.json)', 'status');
}

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
if (sfxstart) {
  sfx.start();
} else {
  response.conlog('sfx', 'sound effects not activated: --no-sound-effects flag', 'status');
}

// start voice
if (speechsynthesisstart) {
  voice.start();
} else {
  response.conlog('voice', 'speech synthesis not activated: --no-voice flag', 'status');
}

// start speech recognition, keyword: sara
if (speechrecognitionstart) {
  hearing.listen();
} else {
  response.conlog('hearing', 'speech recognition not activated: --no-speech-recognition flag', 'status');
}

// start vision
if (visionstart) {
  vision.start();
} else {
  response.conlog('vision', 'vision not activated: --no-vision flag', 'status');
}

// start bootstrap
if (bootstrapstart) {
  bootstrap.start();
} else {
  response.conlog('bootstrap', 'bootstrap not activated: --no-bootstrap flag', 'status');
}

sfx.output('startup');

/*
function myFunc() {
  prompt.write('This is a test');
}
setTimeout(myFunc, 5000); 
*/

function loadconfig() {
  const fs = require('fs')
  const path = './config.json'

  try {
    if (fs.existsSync(path)) {
      configfilefound = true;
      var configfile = require('./config.json');
      if (configfile['speech synthesis'] == true) {
        speechsynthesisstart = true;
      } else {
        speechsynthesisstart = false;
      }
      if (configfile['speech recognition'] == true) {
        speechrecognitionstart = true;
      } else {
        speechrecognitionstart = false;
      }
      if (configfile['vision'] == true) {
        visionstart = true;
      } else {
        visionstart = false;
      }
      if (configfile['sound effects'] == true) {
        sfxstart = true;
      } else {
        sfxstart = false;
      }
      if (configfile['colors'] == true) {
        colorstart = true;
      } else {
        colorstart = false;
      }
      if (configfile['bootstrap'] == true) {
        bootstrapstart = true;
      } else {
        bootstrapstart = false;
      }
      if (configfile['verbose'] == true) {
        verbose = true;
      } else {
        verbose = false;
      }
    }
  } catch(err) {
    configfilefound = false;
  }

}

function argumental() {
  process.argv.forEach(function (val, index, array) {
    val = val.trim();
    if (val.toLowerCase() == '--verbose' || val == '-v') {
      verbose = true;
    }
    if (val.toLowerCase() == '--no-bootstrap' || val == '-nb') {
      bootstrapstart = false;
    }
    if (val.toLowerCase() == '--no-colors' || val == '-nc') {
      colorstart = false;
    }
    if (val.toLowerCase() == '--no-sound-effects' || val == '-nse') {
      sfxstart = false;
    }
    if (val.toLowerCase() == '--no-voice' || val == '-nv') {
      speechsynthesisstart = false;
    }
    if (val.toLowerCase() == '--no-vision' || val == '-nV') {
      visionstart = false;
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
      console.log('\t-nb, --no-bootstrap\tDo not activate bootstrap plugins on start');
      console.log('\t-nc, --no-colors\tDo not activate colored responses on start');
      console.log('\t-nse, --no-sound-effects\tDo not activate sound effects on start');
      console.log('\t-nsr, --no-speech-recognition\tDo not activate speech recognition on start');
      console.log('\t-nv, --no-voice\tDo not activate speech synthesis on start');
      console.log('\t-nV, --no-vision\tDo not activate webcam on start');
      console.log('\t-v, --verbose\tDisplay additional information, noisy (debug data)');
      console.log('\t-V, --version\tDisplay version number and exits');
      console.log('');
      console.log('config file:');
      console.log('\tThe file config.json allow you to set the above arguments as default');
      console.log('\t\Arguments override config.json settings');
      console.log('\t\'verbose: false\' in config.json AND --verbose will turn ON verbose');
      console.log('');
      console.log('Internal help function is available by typing \'help\' in SARAs prompt');
      process.exit();
    }
    if (val.toLowerCase() == '--version' || val == '-V') {
      const { version } = require('./package.json');
      console.log('(--version)');
      console.log('');
      console.log(version);
      process.exit();
    }
  });
}