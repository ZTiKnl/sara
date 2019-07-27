// include weather-js2 module
const weather = require('weather-js2');

// include weather-js2 module
const getlocation = require('./location.js');

module.exports = {
  place: async function (lctn) {
    let weatherstring = await weatherlocation(lctn[1]).then((result) => {
      let wthrline = 'Weather for '+result[0]['current']['observationpoint']+'\n\tSky: '+result[0]['current']['skytext']+'\n\tTemperature: '+result[0]['current']['temperature']+'° celcius\n\tFeels like: '+result[0]['current']['feelslike']+'° celcius\n\tHumidity: '+result[0]['current']['humidity']+'%\n\tWind: '+result[0]['current']['winddisplay'];
      return wthrline;
    })
    return weatherstring;
  },
  local: async function () {
    let loc = await getlocation.city();
    let weatherstring = await weatherlocation(loc).then((result) => {
      let wthrline = 'Weather for '+result[0]['current']['observationpoint']+'\n\tSky: '+result[0]['current']['skytext']+'\n\tTemperature: '+result[0]['current']['temperature']+'° celcius\n\tFeels like: '+result[0]['current']['feelslike']+'° celcius\n\tHumidity: '+result[0]['current']['humidity']+'%\n\tWind: '+result[0]['current']['winddisplay'];
      return wthrline;
    })
    return weatherstring;
  },
  forecast: async function (lctn) {
    let weatherstring = await weatherlocation(lctn[1]).then((result) => {
      let wthrline = 'Weather forecast for '+result[0]['current']['observationpoint']+'\n\n';
      wthrline += result[0]['forecast'][0]['day']+', '+result[0]['forecast'][0]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][0]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][0]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][0]['high']+'° celcius\n\tRain: '+result[0]['forecast'][0]['precip']+'\n\n';
      wthrline += result[0]['forecast'][1]['day']+', '+result[0]['forecast'][1]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][1]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][1]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][1]['high']+'° celcius\n\tRain: '+result[0]['forecast'][1]['precip']+'\n\n';
      wthrline += result[0]['forecast'][2]['day']+', '+result[0]['forecast'][2]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][2]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][2]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][2]['high']+'° celcius\n\tRain: '+result[0]['forecast'][2]['precip']+'\n\n';
      wthrline += result[0]['forecast'][3]['day']+', '+result[0]['forecast'][3]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][3]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][3]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][3]['high']+'° celcius\n\tRain: '+result[0]['forecast'][3]['precip']+'\n\n';
      wthrline += result[0]['forecast'][4]['day']+', '+result[0]['forecast'][4]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][4]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][4]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][4]['high']+'° celcius\n\tRain: '+result[0]['forecast'][4]['precip']+'\n\n';
      return wthrline;
    })
    return weatherstring;
  },
  forecastlocal: async function () {
    let loc = await getlocation.city();
    let weatherstring = await weatherlocation(loc).then((result) => {
      let wthrline = 'Weather forecast for '+result[0]['current']['observationpoint']+'\n\n';
      wthrline += result[0]['forecast'][0]['day']+', '+result[0]['forecast'][0]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][0]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][0]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][0]['high']+'° celcius\n\tRain: '+result[0]['forecast'][0]['precip']+'\n\n';
      wthrline += result[0]['forecast'][1]['day']+', '+result[0]['forecast'][1]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][1]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][1]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][1]['high']+'° celcius\n\tRain: '+result[0]['forecast'][1]['precip']+'\n\n';
      wthrline += result[0]['forecast'][2]['day']+', '+result[0]['forecast'][2]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][2]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][2]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][2]['high']+'° celcius\n\tRain: '+result[0]['forecast'][2]['precip']+'\n\n';
      wthrline += result[0]['forecast'][3]['day']+', '+result[0]['forecast'][3]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][3]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][3]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][3]['high']+'° celcius\n\tRain: '+result[0]['forecast'][3]['precip']+'\n\n';
      wthrline += result[0]['forecast'][4]['day']+', '+result[0]['forecast'][4]['date']+':\n';
      wthrline += '\tSky: '+result[0]['forecast'][4]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][4]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][4]['high']+'° celcius\n\tRain: '+result[0]['forecast'][4]['precip']+'\n\n';
      return wthrline;
    })
    return weatherstring;
  }
}

function weatherlocation(loc) {
  return new Promise(resolve => {
    weather.find({search: loc, degreeType: 'C', resCount: 1}, function(err, result) {
      if(err) response.conlog('weather plugin', ''+err.message, 'error');
      resolve(result);
    });
  })
}
