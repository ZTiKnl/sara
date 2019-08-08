// include weather-js2 module
const weather = require('weather-js2');

// include weather-js2 module
const getlocation = require('./location.js');

module.exports = {
  place: async function (lctn) {
    let weatherstring = await weatherlocation(lctn[1]).then((result) => {
      let wthrline = ['Weather for '+result[0]['current']['observationpoint']+'\n\tSky: '+result[0]['current']['skytext']+'\n\tTemperature: '+result[0]['current']['temperature']+'° celcius\n\tFeels like: '+result[0]['current']['feelslike']+'° celcius\n\tHumidity: '+result[0]['current']['humidity']+'%\n\tWind: '+result[0]['current']['winddisplay']];
      wthrline[1] = wthrline[0].replace(/°/gi, " degrees");
      return wthrline;
    })
    result = [weatherstring[0]];
    result[1] = weatherstring[1];
    return result;
  },
  local: async function () {
    let loc = await getlocation.city();
    let weatherstring = await weatherlocation(loc).then((result) => {
      let wthrline = ['Weather for '+result[0]['current']['observationpoint']+'\n\tSky: '+result[0]['current']['skytext']+'\n\tTemperature: '+result[0]['current']['temperature']+'° celcius\n\tFeels like: '+result[0]['current']['feelslike']+'° celcius\n\tHumidity: '+result[0]['current']['humidity']+'%\n\tWind: '+result[0]['current']['winddisplay']];
      wthrline[1] = wthrline[0].replace(/°/gi, " degrees");
      return wthrline;
    })
    result = [weatherstring[0]];
    result[1] = weatherstring[1];
    return result;
  },
  forecast: async function (lctn) {
    let weatherstring = await weatherlocation(lctn[1]).then((result) => {
      let wthrline = ['Weather forecast for '+result[0]['current']['observationpoint']+'\n\n'];
      wthrline[0] += result[0]['forecast'][0]['day']+', '+result[0]['forecast'][0]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][0]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][0]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][0]['high']+'° celcius\n\tRain: '+result[0]['forecast'][0]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][1]['day']+', '+result[0]['forecast'][1]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][1]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][1]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][1]['high']+'° celcius\n\tRain: '+result[0]['forecast'][1]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][2]['day']+', '+result[0]['forecast'][2]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][2]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][2]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][2]['high']+'° celcius\n\tRain: '+result[0]['forecast'][2]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][3]['day']+', '+result[0]['forecast'][3]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][3]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][3]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][3]['high']+'° celcius\n\tRain: '+result[0]['forecast'][3]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][4]['day']+', '+result[0]['forecast'][4]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][4]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][4]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][4]['high']+'° celcius\n\tRain: '+result[0]['forecast'][4]['precip']+'\n\n';
      wthrline[1] = wthrline[0].replace(/°/gi, " degrees");
      return wthrline;
    })
    result = [weatherstring[0]];
    result[1] = weatherstring[1];
    return result;
  },
  forecastlocal: async function () {
    let loc = await getlocation.city();
    let weatherstring = await weatherlocation(loc).then((result) => {
      let wthrline = ['Weather forecast for '+result[0]['current']['observationpoint']+'\n\n'];
      wthrline[0] += result[0]['forecast'][0]['day']+', '+result[0]['forecast'][0]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][0]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][0]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][0]['high']+'° celcius\n\tRain: '+result[0]['forecast'][0]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][1]['day']+', '+result[0]['forecast'][1]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][1]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][1]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][1]['high']+'° celcius\n\tRain: '+result[0]['forecast'][1]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][2]['day']+', '+result[0]['forecast'][2]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][2]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][2]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][2]['high']+'° celcius\n\tRain: '+result[0]['forecast'][2]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][3]['day']+', '+result[0]['forecast'][3]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][3]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][3]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][3]['high']+'° celcius\n\tRain: '+result[0]['forecast'][3]['precip']+'\n\n';
      wthrline[0] += result[0]['forecast'][4]['day']+', '+result[0]['forecast'][4]['date']+':\n';
      wthrline[0] += '\tSky: '+result[0]['forecast'][4]['skytextday']+'\n\tTemperature min: '+result[0]['forecast'][4]['low']+'° celcius\n\tTemperature max: '+result[0]['forecast'][4]['high']+'° celcius\n\tRain: '+result[0]['forecast'][4]['precip']+'\n\n';
      wthrline[1] = wthrline[0].replace(/°/gi, " degrees");
      return wthrline;
    })
    result = [weatherstring[0]];
    result[1] = weatherstring[1];
    return result;
  }
}

function weatherlocation(loc) {
  return new Promise(resolve => {
    weather.find({search: loc, degreeType: 'C', resCount: 1}, function(err, result) {
      if(err) response.conlog('plugin/weather', ''+err.message, 'error');
      resolve(result);
    });
  })
}
