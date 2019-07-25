// set start vars
var visionactive = false;

// include colored responses module
const response = require('./response.js');

// include node-webcam module
const NodeWebcam = require( "node-webcam" );

// Imports the Google Cloud client library
const cloudvision = require('@google-cloud/vision');

// Creates a client
const client = new cloudvision.ImageAnnotatorClient({
  projectId: 'sara-245106',
  keyFilename: 'resources/apikeys/googlecloud.json'
})

// start vars
var snapshot;
var interval = 1000 * 60 * 5 // 30 minutes = 2x per hour = 48 per day
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

function myFunc() {
  tester();
}
setTimeout(myFunc, 15000); 

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