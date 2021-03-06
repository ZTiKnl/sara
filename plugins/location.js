// include GeoIP Lite module
const geoip = require('geoip-lite');

// include public-ip module
const publicIp = require('public-ip');

// include country-list module
const countrylist = require('country-list');

// starting vars
var myip;

module.exports = {
  country: async function () {
    myip = await publicIp.v4();
    let result = [countrylist.getName(geoip.lookup(myip).country)];
    result[1] = result[0];
    return result;
  },
  region: async function () {
    myip = await publicIp.v4();
    let result = [geoip.lookup(myip).region];
    result[1] = result[0];
    return result;
  },
  city: async function () {
    myip = await publicIp.v4();
    let result = [geoip.lookup(myip).city];
    result[1] = result[0];
    return result;
  },
  latlong: async function () {
    myip = await publicIp.v4();
    let result = [geoip.lookup(myip).ll];
    result[1] = result[0];
    return result;
  },
  timezone: async function () {
    myip = await publicIp.v4();
    let result = [geoip.lookup(myip).timezone];
    result[1] = result[0];
    return result;
  },
  general: async function () {
    myip = await publicIp.v4();
    let result = [geoip.lookup(myip).city+', '+countrylist.getName(geoip.lookup(myip).country)];
    result[1] = result[0];
    return result;
  }
}