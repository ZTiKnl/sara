const weather = require('weather-js2');

module.exports = {
  atlocation: async function (lctn) {
    let weatherstring = await weatherlocation(lctn[1]).then((result) => {
      let wthrline = '\n\tPoint of Measurement: '+result[0]['current']['observationpoint']+'\n\tSky: '+result[0]['current']['skytext']+'\n\tTemperature: '+result[0]['current']['temperature']+'\n\tFeels like: '+result[0]['current']['feelslike']+'\n\tHumidity: '+result[0]['current']['humidity']+'\n\tWind: '+result[0]['current']['winddisplay'];
      return wthrline;
    })
    return weatherstring;
  }
}

function weatherlocation(loc) {
  return new Promise(resolve => {
    weather.find({search: loc, degreeType: 'C', resCount: 1}, function(err, result) {
      if(err) console.log(err);
      resolve(result);
    });
  })
}
