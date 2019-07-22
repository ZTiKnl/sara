// include fs module
const fs = require('fs');

// include colors module
const chalk = require('chalk');

// include colored responses module
const response = require('./response.js');

// include help function module
const help = require('./help.js');

// include voice synthesis module
const voice = require('./voice.js');

// include speech recognition module
const hearing = require('./hearing.js');

// include vision module
const vision = require('./vision.js');

// include plugins module
const plugins = require('./plugins.js');

// set start vars
var commands = [];
const readline = require('readline'),
    util = require('util'),
    EventEmitter = require('events');

readline.cursorTo(process.stdout, 0, process.stdout.rows);

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

var rl;
var completions = [];

if (response.getcolors()) {
  var myPrompt = chalk.bold.magentaBright('<input> ');
} else {
  var myPrompt = '<input> ';
}

module.exports = (function() {
    return {
        question: question,
        write: write,
        start: start,
        getPrompt: function() {
            return myPrompt;
        },
        setCompletion: function(obj) {
            completions = (typeof obj == 'object') ? obj : completions;
        },
        setPrompt: function(str) {
            myPrompt = str;
            rl.setPrompt(myPrompt);
        },
        on: function(line) {
            myEmitter.on.apply(myEmitter, arguments);
        }
    };
})();

function question(string) {
  return new Promise(resolve => {
    string = '<'+string+'> '
    if (response.getcolors()) {
      string = chalk.bold.magentaBright(string);
    }
    rl.question(string, (answer) => {
      resolve(answer)
    })
  })
}

function runcmd(string) {
  return new Promise(resolve => {
    let result = plugins.match(string).then((result) => {
      resolve(result);
    })
  })
}

function write(string) {
    rl.write(string);
}

function start(strPrompt, callback) {
  if (response.getcolors()) {
    myPrompt = chalk.bold.magentaBright('<input> ');
  } else {
    myPrompt = '<input> ';
  }

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer
    });

    rl.setPrompt(myPrompt);
    rl.on('line', function(line) {
      rl.history.push(line);
//      myEmitter.emit('line', line);
      
      line = line.trim().toLowerCase();

      var regex = /^(?:sara|sarah|s.a.r.a.|s.a.r.a)?\s?,?\s?(?:please)?\s?(?:can\syou|could\syou)?\s?(?:tell\sme|let\sme\sknow)?\s?(?:please)?\s?/i
      line = line.replace(regex, '').trim();

      var regex = /\.?,?\s?(?:sara|sarah|s.a.r.a.|s.a.r.a)?\s?(?:please)?\s?(?:\?|\!)?\s?$/i
      line = line.replace(regex, '').trim();

      line = line.replace(/(?:\s)+/g, ' ').trim();


      var subcommands = false;
      splitcommands(line);

      function splitcommands(cmd) {
        if (subcommands) {
          response.conlog('prompt', 'processing final command', 'info');
        }
        var end = cmd.indexOf(")");
        var sub = cmd.substr(0, end);
        var start = sub.lastIndexOf("(");
        var sub = sub.substr(start+1);
      
        if (start == -1 || end == -1) {
          processcmd(cmd).then((result) => {

            response.conlog('prompt', result, 'response');

          });
        } else {
          response.conlog('prompt', 'processing subcommand', 'info');
          subcommands = true;
          processcmd(sub).then((result) => {

            response.conlog('prompt', result, 'data');

            stline = cmd.substr(0, start);
            enline = cmd.substr(end+1);
            splitcommands(stline+result+enline);
          });
        }
      }
      
      function processcmd(cmd) {
        return new Promise(resolve => {
          if (cmd == '' || cmd == ' ') {
            response.conlog('input', 'no command entered', 'error');
          } else {
            response.conlog('input', cmd, 'command');
            if (cmd == 'help' || cmd.substr(0, 4) == 'help') {
              help.get(cmd);
            } else if (cmd.substr(0, 9) == 'edit help') {
              if (cmd == 'edit help') {
                response.conlog('help', 'Please enter the topic to edit', 'error');
              } else {
                cmd = cmd.substr(10, cmd.length).trim();

                let path = './documentation/'+cmd+'.json';
                fs.readFile(path, 'utf8', function (err, data) {
                  if (err) {
                    response.conlog('help', 'Couldn\'t read JSON file: '+err.message, 'error');
                  }
                  var obj = JSON.parse(data);
                  help.questions(obj.name, obj.description, obj.explanation, 'update')
                });
              }
            } else if (cmd == 'add help') {
              help.questions(null, null, null, null, 'add');
            } else if (cmd == 'start listening') {
              hearing.listen()
            } else if (cmd == 'stop listening') {
              hearing.stop()
            } else if (cmd == 'start voice') {
              voice.start()
            } else if (cmd == 'stop voice') {
              voice.stop()
            } else if (cmd == 'start vision') {
              vision.start()
            } else if (cmd == 'stop vision') {
              vision.stop()
            } else if (cmd == 'silence') {
              voice.silence()
            } else if (cmd == 'start colors') {
              if (!response.getcolors()) {
                rl.setPrompt(chalk.bold.magentaBright('<input> '));
              }
              response.setcolors()
            } else if (cmd == 'stop colors') {
              if (response.getcolors()) {
                rl.setPrompt('<input> ');
              }
              response.unsetcolors()
            } else if (cmd == 'start verbose') {
              response.setverbose()
            } else if (cmd == 'stop verbose') {
              response.unsetverbose()
            } else if (cmd == 'exit') {
              rl.close();
            } else {
              runcmd(cmd).then((result) => {
                resolve(result);
              });
            }
          }
        })
      }
    });
    rl.on('close', function() {
        response.conlog('sara', 'shutting down', 'info');
        myEmitter.emit('close');
        return process.exit(1);
    });
    rl.on('SIGINT', function() {
        rl.clearLine();
        response.conlog('sara', 'shutting down', 'info');
        if (!myEmitter.emit('SIGINT', rl))
            process.exit(1);
    });
    
    rl.prompt();

    hiddenOverwrite();
    consoleOverwrite();

    response.conlog('prompt', 'input prompt activated', 'status');
}


function hiddenOverwrite() {
    rl._refreshLine = (function(refresh) {
    //https://github.com/nodejs/node/blob/v9.5.0/lib/readline.js#L335
        return function _refreshLine() {

            refresh.apply(rl);

        }
    })(rl._refreshLine);

    //https://github.com/nodejs/node/blob/v9.5.0/lib/readline.js#L442
    function _insertString(c) {
        if (this.cursor < this.line.length) {
            var beg = this.line.slice(0, this.cursor);
            var end = this.line.slice(this.cursor, this.line.length);
            this.line = beg + c + end;
            this.cursor += c.length;
            this._refreshLine();
        } else {
            this.line += c;
            this.cursor += c.length;

            if (this._getCursorPos().cols === 0) {
                this._refreshLine();
            } else {
                   this._writeToOutput(c);
            }

            // a hack to get the line refreshed if it's needed
            this._moveCursor(0);
        }
    };
    rl._insertString = _insertString;
}

function consoleOverwrite() {
    var myWrite = function(stream, string, errorhandler) {
        process.stdout.write(rl.columns);
        var nbline = Math.ceil((rl.line.length + 3) / rl.columns);
        var text = '';
        text += '\n\r\x1B[' + nbline + 'A\x1B[0J';
        text += string + '\r';
        text += Array(nbline).join('\r\x1B[1E');

        stream.write(text, errorhandler);

        rl._refreshLine();
    };
    const kGroupIndent = Symbol('groupIndent');
    console[kGroupIndent] = '';
    let MAX_STACK_MESSAGE;

    function noop() {}

    //Internal function console.js : https://github.com/nodejs/node/blob/v9.5.0/lib/console.js#L96
    function write(ignoreErrors, stream, string, errorhandler, groupIndent) {
        if (groupIndent.length !== 0) {
            if (string.indexOf('\n') !== -1) {
                string = string.replace(/\n/g, `\n${groupIndent}`);
            }
            string = groupIndent + string;
        }
        string += '\n';

        if (ignoreErrors === false) return myWrite(stream, string, errorhandler);

        try {
            stream.once('error', noop);
            myWrite(stream, string, errorhandler);
        } catch (e) {
            if (MAX_STACK_MESSAGE === undefined) {
                try {
                    function a() {
                        a();
                    }
                } catch (err) {
                    MAX_STACK_MESSAGE = err.message;
                }
            }
            if (e.message === MAX_STACK_MESSAGE && e.name === 'RangeError')
                throw e;
        } finally {
            stream.removeListener('error', noop);
        }
    }
    console.log = function log(...args) {
        write(console._ignoreErrors,
            console._stdout,
            util.format.apply(null, args),
            console._stdoutErrorHandler,
            console[kGroupIndent]);
    };
    console.debug = console.log;
    console.info = console.log;
    console.dirxml = console.log;

    console.warn = function warn(...args) {
        write(console._ignoreErrors,
            console._stderr,
            util.format.apply(null, args),
            console._stderrErrorHandler,
            console[kGroupIndent]);
    };
    console.error = console.warn;

    console.dir = function dir(object, options) {
        options = Object.assign({
            customInspect: false
        }, options);
        write(console._ignoreErrors,
            console._stdout,
            util.inspect(object, options),
            console._stdoutErrorHandler,
            console[kGroupIndent]);
    };
}

function completer(line) {
    var n = line.trim().split(' ');
    line = n[n.length - 1];

    var hits = completions.filter(function(c) {
        return c.indexOf(line) == 0;
    });

    if (hits.length == 1) {
        return [hits, line];
    } else {
        var list = '',
            l = 0,
            c = '',
            t = hits.length ? hits : completions;
        for (var i = 0; i < t.length; i++) {
            c = t[i].replace(/(\s*)$/g, '')
            if (list != '') {
                list += ', ';
            }
            if (((list + c).length + 4 - l) > process.stdout.columns) {
                list += '\n';
                l = list.length;
            }
            list += c;
        }
        response.conlog('autocomplete', list, 'options');
        return [hits, line];
    }
}