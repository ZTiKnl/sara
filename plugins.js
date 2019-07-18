// include fs module
const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);

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
      var commandfound = false;
      var argumentarray = [];
      const files = await readdir('plugins');
      const commands = files
        .filter(file => file.endsWith('.json'))
        .map(file => load(`plugins/${file}`));

      commands.forEach(command => {
        const plugin = load(`plugins/${command.module}.js`);
        const fn = plugin[command.name];
          var result = eval(command.regex).exec(line)
          if (result) {
            result.forEach(async function(element) {
              var matches = element.match(eval(command.regex));
              if (matches !== null) {
                commandfound = true;
                response.conlog('plugincheck', 'found match: '+command.module+'.'+command.name, 'data');
                matches.forEach(function(argument) {
                  argumentarray.push(argument);
                })

                //speak result
  //              console.log('result: '+fn(argumentarray));
  //              return;
                let rslt = fn(argumentarray);
  //              console.log(fn(argumentarray));
                resolve(rslt);
              }
            });
          }
      });
      if (commandfound == false) {
        response.conlog('pluginloader', 'Couldn\'t find matching plugin for command: '+line, 'error');
      }
    })().catch(err => {
      response.conlog('pluginloader', 'Couldn\'t scan plugins: '+err.message, 'error');
    });
  })
}