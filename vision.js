// set start vars
var visionactive = false;
var api_id;
var api_file;
var wc_width;
var wc_height;
var wc_quality;
var wc_saveshots;
var wc_output;
var wc_device;
var wc_verbose;

// process config.json file
loadconfig();

// include colored responses module
const response = require('./response.js');

// include node-webcam module
const NodeWebcam = require( "node-webcam" );

// Imports the Google Cloud client library
const cloudvision = require('@google-cloud/vision');

// Creates a client
const client = new cloudvision.ImageAnnotatorClient({
  projectId: api_id, //'sara-245106',
  keyFilename: api_file //'resources/apikeys/googlecloud.json'
})

// start vars
var snapshot;
var interval = 1000 * 60 * 30 // 30 minutes = 2x per hour = 48 per day
var opts = {
    width: wc_width,
    height: wc_height,
    quality: wc_quality,
    saveShots: wc_saveshots,
    output: wc_output,
    device: wc_device,
    callbackReturn: "location",
    verbose: wc_verbose
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
    snapshot = setInterval(intervalFunc,interval);
    visionactive = true;
  }
}
function stop() {
  if (visionactive) {
    response.conlog('vision', 'vision deactivated', 'status');
    clearTimeout(snapshot);
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
    Webcam.capture( "resources/vision/frame", function( err, data ) {
      if (err) {
        console.log('error, couldn\'t take picture: '+err.message);
        return;
      }
      response.conlog('vision', 'vision refreshed', 'data');
      resolve()
    });
  });
}
/*
function myFunc() {
  tester();
}
setTimeout(myFunc, 15000); 
*/
async function tester(inputFile) {
  inputFile = './resources/vision/frame.png';
  var outputFile = './resources/vision/faces.png';
  const Canvas = require('canvas');
  const faces = await detectfaces(inputFile);
  console.log('Highlighting...');
  await highlightfaces(inputFile, faces, outputFile, Canvas);
  console.log('Finished!');
}

async function detectlabels() {
  // Performs label detection on the image file
  const [result] = await client.labelDetection('./resources/vision/frame.png');
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}

function detectobjects() {
  console.log('detecting objects');
}
async function detectfaces(inputFile) {
  inputFile = './resources/vision/frame.png';
  // Make a call to the Vision API to detect the faces
  const request = {image: {source: {filename: inputFile}}};
  const results = await client.faceDetection(request);
  const faces = results[0].faceAnnotations;
  const numFaces = faces.length;
  console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);
  return faces;
}
function searchface() {
  console.log('searching for face');
}
function searchobject() {
  console.log('searching for object');
}





async function highlightfaces(inputFile, faces, outputFile, Canvas) {
  const fs = require('fs');
  const {promisify} = require('util');
  const readFile = promisify(fs.readFile);
  const image = await readFile(inputFile);
  const Image = Canvas.Image;
  // Open the original image into a canvas
  const img = new Image();
  img.src = image;
  const canvas = new Canvas.Canvas(img.width, img.height);
  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height);

  // Now draw boxes around all the faces
  context.strokeStyle = 'rgba(0,255,0,0.8)';
  context.lineWidth = '5';

  faces.forEach(face => {
    context.beginPath();
    let origX = 0;
    let origY = 0;
    face.boundingPoly.vertices.forEach((bounds, i) => {
      if (i === 0) {
        origX = bounds.x;
        origY = bounds.y;
      }
      context.lineTo(bounds.x, bounds.y);
    });
    context.lineTo(origX, origY);
    context.stroke();
  });

  // Write the result to a file
  console.log(`Writing to file ${outputFile}`);
  const writeStream = fs.createWriteStream(outputFile);
  const pngStream = canvas.pngStream();

  await new Promise((resolve, reject) => {
    pngStream
      .on('data', chunk => writeStream.write(chunk))
      .on('error', reject)
      .on('end', resolve);
  });
}

function loadconfig() {
  const fs = require('fs')
  const path = './config.json'

  try {
    if (fs.existsSync(path)) {
      var configfile = require('./config.json');
      if (configfile['google cloud']['projectid'] != null && configfile['google cloud']['file'] != null) {
        api_id = configfile['google cloud']['projectid'];
        api_file = configfile['google cloud']['file'];
      } else {
        api_id = 'sara-245106';
        api_file = './resources/apikeys/googlecloud.json';
      }
      if (configfile['webcam']['width'] != null) {
        wc_width = configfile['webcam']['width'];
      } else {
        wc_width = 1280;
      }
      if (configfile['webcam']['height'] != null) {
        wc_height = configfile['webcam']['height'];
      } else {
        wc_height = 720;
      }
      if (configfile['webcam']['quality'] != null) {
        wc_quality = configfile['webcam']['quality'];
      } else {
        wc_quality = 100;
      }
      if (configfile['webcam']['output'] != null) {
        wc_output = configfile['webcam']['output'];
      } else {
        wc_output = "png";
      }
      if (configfile['webcam']['saveshots'] != null) {
        wc_saveshots = configfile['webcam']['saveshots'];
      } else {
        wc_saveshots = false;
      }
      if (configfile['webcam']['device'] != null) {
        wc_device = configfile['webcam']['device'];
      } else {
        wc_device = false;
      }
      if (configfile['webcam']['verbose'] != null) {
        wc_verbose = configfile['webcam']['verbose'];
      } else {
        wc_verbose = false;
      }
    }
  } catch(err) {
  }

}