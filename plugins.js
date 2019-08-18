// include fs module
const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);

// include colored responses module
const response = require('./response.js');

module.exports = {
  match: plugincheck
}

function load (path) {
  return require(resolve(process.cwd(), path));
}

function plugincheck (line) {
  return new Promise(resolve => {
    (async function () {
      var pluginfound = false;
      const files = await readdir('plugins');
      const plugins = files
        .filter(file => file.endsWith('.json'))
        .map(file => load(`plugins/${file}`));

      var i = 0;
      var amount = plugins.length;
      while (i < amount) {
        var re = new RegExp(plugins[i]['regex'], 'i');
        var result = re.exec(line);
        if (result) {
          pluginfound = true;
          response.conlog('plugincheck', 'found match: '+plugins[i]['module']+'.'+plugins[i]['name'], 'data');
          
          const plugin = load('plugins/'+plugins[i]['module']+'.js');
          const fn = plugin[plugins[i]['name']];
          let rslt = fn(result);
          resolve(rslt);
        }
        
        if (result) {
          i = amount;
        } else {
          i++;
        }
      }

      if (pluginfound == false) {
        response.conlog('pluginloader', 'Couldn\'t find matching plugin for command: '+line, 'error');
      }
    })().catch(err => {
      response.conlog('pluginloader', 'Couldn\'t scan plugins: '+err, 'error');
    });
  })
}