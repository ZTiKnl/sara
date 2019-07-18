const geoip = require('geoip-lite');
const publicIp = require('public-ip');
const countrylist = require('country-list');

var myip;

module.exports = {
  country: async function () {
    myip = await publicIp.v4();
    let result = countrylist.getName(geoip.lookup(myip).country);
    return result;
  },
  region: async function () {
    myip = await publicIp.v4();
    let result = geoip.lookup(myip).region;
    return result;
  },
  city: async function () {
    myip = await publicIp.v4();
    let result = geoip.lookup(myip).city;
    return result;
  },
  latlong: async function () {
    myip = await publicIp.v4();
    let result = geoip.lookup(myip).ll;
    return result;
  },
  timezone: async function () {
    myip = await publicIp.v4();
    let result = geoip.lookup(myip).timezone;
    return result;
  },
  general: async function () {
    myip = await publicIp.v4();
    let result = geoip.lookup(myip).city+', '+countrylist.getName(geoip.lookup(myip).country);
    return result;
  }
}