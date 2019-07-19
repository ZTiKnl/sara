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
      var argumentarray = [];
      const files = await readdir('plugins');
      const plugins = files
        .filter(file => file.endsWith('.json'))
        .map(file => load(`plugins/${file}`));

      plugins.forEach(plugindata => {
        const plugin = load(`plugins/${plugindata.module}.js`);
        const fn = plugin[plugindata.name];
          var result = eval(plugindata.regex).exec(line)
          if (result) {
            result.forEach(async function(element) {
              var matches = element.match(eval(plugindata.regex));
              if (matches !== null) {
                commandfound = true;
                response.conlog('plugincheck', 'found match: '+plugindata.module+'.'+plugindata.name, 'data');
                matches.forEach(function(argument) {
                  argumentarray.push(argument);
                })

                //speak result here, or add function to responses.conlog (type == 'response') ?
                //console.log(fn(argumentarray));
                let rslt = fn(argumentarray);
                resolve(rslt);
              }
            });
          }
      });
      if (pluginfound == false) {
        response.conlog('pluginloader', 'Couldn\'t find matching plugin for command: '+line, 'error');
      }
    })().catch(err => {
      response.conlog('pluginloader', 'Couldn\'t scan plugins: '+err.message, 'error');
    });
  })
}