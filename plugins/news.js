// include colored responses module
const response = require('../response.js');

const request = require('request');
const he = require('he');

var apikey = 'daebb2de3f3943169ff9106707c33b10';

// starting vars
var news_config = require('./news/newsorg.json');

module.exports = {
  headlines: async function () {
    query = 'top-headlines?language=en&category=general';
    var result = await newsquery(query);
    return result;
  },
  headlinescountry: async function (query) {
    //country -> two letter code
    query[1] = 'top-headlines?language=en&country='+he.encode(query[1]);
    var result = await newsquery(query[1]);
    return result;
  },
  headlinescategory: async function (query) {
    query[1] = 'top-headlines?language=en&category=general';
    var result = await newsquery(query[1]);
    return result;
  },
  headlinestopic: async function (query) {
    query[1] = 'everything?language=en&q='+he.encode(query[1]);
    var result = await newsquery(query[1]);
    return result;
  },
  headlinessource: async function (query) {
    query[1] = 'top-headlines?sources='+he.encode(query[1]);
    var result = await newsquery(query[1]);
    return result;
  }
}

function newsquery(text) {
  return new Promise(resolve => {
    if (text == '') {
      var apilink = 'https://newsapi.org/v2/top-headlines?language=en&category=general&apiKey='+news_config.key;
    } else {
      var apilink = 'https://newsapi.org/v2/'+text+'&apiKey='+news_config.key;
    }
    return request(apilink, { json: true }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      if (body['status'] == 'ok') {
        console.log('succes');
        if (body['totalResults'] > 0) {
          var i = 0;
          var result;
          var max;
          if (body['totalResults'] > 10) {
            max = 10;
          } else {
            max = body['totalResults'];
          }
          while (i < max) {
            if (i < 1) {
              result = body['articles'][i]['source']['name']+': '+body['articles'][i]['title']+'\n';
            } else {
              result += body['articles'][i]['source']['name']+': '+body['articles'][i]['title']+'\n';
            }
            i++;
          }

          resolve(result);          
        }
      } else {
        resolve(body['status']+': '+body['message']);
      }
    });
  })
}