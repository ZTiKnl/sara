// set start vars
var visionactive = false;

// include colored responses module
const response = require('./response.js');

// include node-webcam module
const NodeWebcam = require( "node-webcam" );

// start vars
var interval;
var opts = {
    //Picture related
    width: 1280,
    height: 720,
    quality: 100,

    //Save shots in memory
    saveShots: false,

    // [jpeg, png] support varies
    output: "png",

    //false for default device
    device: false,

    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: "location",

    //Logging
    verbose: false
};

// start webcam interface
var Webcam = NodeWebcam.create( opts );

module.exports = {
  start: start,
  stop: stop,
  status: status,
  refresh: newimage,
  detectobjects: detectobjects,
  detectfaces: detectfaces,
  searchface: searchface,
  searchobject: searchobject
}

function start() {
  if (visionactive) {
    response.conlog('vision', 'vision is already activated', 'status');
  } else {
    response.conlog('vision', 'vision activated', 'status');
    function intervalFunc() {
      //module.exports.newimage();
      newimage();
      //console.log('<snap>');
    }
    interval = setInterval(intervalFunc,15000);
    visionactive = true;
  }
}
function stop() {
  if (visionactive) {
    response.conlog('vision', 'vision deactivated', 'status');
    clearTimeout(interval);
    visionactive = false;
  } else {
    response.conlog('vision', 'vision is already deactivated', 'status');
  }
}

function status() {
  return visionactive;
}

function newimage() {
  return new Promise(resolve => {
    Webcam.capture( "resources/fswebcam/frame", function( err, data ) {
      if (err) {
        console.log('error, couldn\'t take picture: '+err.message);
        return;
      }
      response.conlog('vision', 'vision refreshed', 'data');
      resolve()
    });
  });
}

function detectobjects() {
  console.log('detecting objects');
}
function detectfaces() {
  console.log('detecting faces');
}
function searchface() {
  console.log('searching for face');
}
function searchobject() {
  console.log('searching for object');
}