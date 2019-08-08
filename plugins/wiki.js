// include colored responses module
const response = require('../response.js');

const request = require('request');
const wikientity = require('wiki-entity');
const he = require('he');

module.exports = {
  description: async function (query) {
    query[1] = uppercasefirstletter(query[1]);

    var rslt = await wikiquery(query[1]);
    if (rslt[0] == null) {
      result = 'Nothing found on subject '+query[1];
    } else {
      if (rslt[0]['description'] == 'Wikipedia disambiguation page') {
        result = 'Multiple matches, please refine query';
      } else {
        result = rslt[0]['label']+': '+rslt[0]['description']
        if (rslt[0]['aliases'] != null) {
          result += '\nAlso known as: '+rslt[0]['aliases'];
        }
      }
    }
    return result;
  },
  subject: async function (query) {
    query[1] = uppercasefirstletter(query[1]);
    query[1] = he.encode(query[1]);
    var result = await wikiquery2(query[1]);
    
    return result;
  }
}

function uppercasefirstletter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function wikiquery(text) {
  return new Promise(resolve => {
    let result = wikientity.getEntities({ language: 'en', titles: [text] }).then((entities) => {
      resolve(entities);
    })
  })
}
function wikiquery2(text) {
  return new Promise(resolve => {
    var apilink = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&exsentences=10&explaintext&exintro&titles='+text+'&format=json';
    return request(apilink, { json: true }, (err, res, body) => {
      if (err) {
        return response.conlog('plugin/wiki', err.message, 'error');
      }
      var keys = Object.keys(body['query']['pages']);
      if (keys.length === 1) {
        if (keys[0] == '-1') {
          var result = 'No matches, please refine query';
          resolve(result);
        } else if (body['query']['pages'][keys[0]]['extract'].includes("may refer to:")) {
          var result = 'Too many matches, please refine query';
          resolve(result);
        } else {
          var result = body['query']['pages'][keys[0]]['extract'];
          result = result.replace(/\. /gi, ".\n")
          resolve(result);          
        }
      }
    });
  })
}