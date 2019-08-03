// include colored responses module
const response = require('../response.js');

// include request module
var request = require('request');

// starting vars
var xbmc_config = require('./xbmc-remote/connection.json');

var xbmc_host = xbmc_config.host;
var xbmc_port = xbmc_config.port;
var xbmc_username = xbmc_config.username;
var xbmc_password = xbmc_config.password;

if (xbmc_username != '' && xbmc_password != '') {
  var xbmc_json_rpc_url = "http://" + xbmc_username + ":" + xbmc_password + "@" + xbmc_host + ":" + xbmc_port + "/jsonrpc";
} else {
  var xbmc_json_rpc_url = "http://" + xbmc_host + ":" + xbmc_port + "/jsonrpc";
}
var headers = {
    'User-Agent': 'xbmcremote.js'
};

var xbmc_options = {
    url: xbmc_json_rpc_url,
    method: 'POST',
    headers: headers,
    json: true,
    gzip: true,
    body: "{}"
};

// enum of basic remote control button actions. Use Input.ExecuteAction for the full set as below
var remote_inputs = {};
    remote_inputs["Up"] = "Input.Up";
    remote_inputs["Down"] = "Input.Down";
    remote_inputs["Left"] = "Input.Left";
    remote_inputs["Right"] = "Input.Right";
    remote_inputs["Back"] = "Input.Back";
    remote_inputs["Select"] = "Input.Select";
    remote_inputs["Home"] = "Input.Home";
    remote_inputs["Info"] = "Input.Info";
    remote_inputs["ContextMenu"] = "Input.ContextMenu";
    
//    remote_inputs["ShowCodec"] = "Input.ShowCodec";
//    remote_inputs["ShowOSD"] = "Input.ShowOSD";
//    remote_inputs["SendText"] = "Input.SendText";
//    remote_inputs["ExecuteAction"] = "Input.ExecuteAction";
//    remote_inputs["PlayPause"] = "Player.PlayPause";


// -----------------------------------------------------------------------------
// export functions for module use
module.exports = {
  move: move,
  multimove: multimove,
  up: up,
  down: down,
  left: left,
  right: right,
  back: back,
  select: select,
  stop: stop,
  pause: pause,
  home: home,
  info: info,
  contextmenu: contextmenu,
  send_input: send_input,
  send_input_action: send_input_action,
  get_player: get_player,
  remote_inputs: remote_inputs
}
// -----------------------------------------------------------------------------

function move(x) {
  return new Promise(resolve => {
    if (x[1] == 'up') {
      up();
    }
    if (x[1] == 'down') {
      down();
    }
    if (x[1] == 'left') {
      left();
    }
    if (x[1] == 'right') {
      right();
    }

    let result = ['Move '+x[1] ];
    result[1] = result[0];
    resolve(result);
  })
}

function multimove(x) {
  return new Promise(resolve => {
    let i = 0;
    let j;
    if (x[2] == undefined) {
      j = 1;
    } else {
      j = x[2];
    }
    while (i < j) {
      if (x[1] == 'up') {
        up();
      }
      if (x[1] == 'down') {
        down();
      }
      if (x[1] == 'left') {
        left();
      }
      if (x[1] == 'right') {
        right();
      }
      i++;
    }
    let result = [j+'x move '+x[1] ];
    result[1] = result[0];
    resolve(result);
  })
}

function up() {
  return new Promise(resolve => {
    send_input(remote_inputs["Up"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Up'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function down() {
  return new Promise(resolve => {
    send_input(remote_inputs["Down"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Down'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function left() {
  return new Promise(resolve => {
    send_input(remote_inputs["Left"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Left'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function right() {
  return new Promise(resolve => {
    send_input(remote_inputs["Right"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Right'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function back() {
  return new Promise(resolve => {
    send_input(remote_inputs["Back"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Back'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function select() {
  return new Promise(resolve => {
    send_input(remote_inputs["Select"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['OK/Select'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function stop() {
  return new Promise(resolve => {
    send_input_action("stop", function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Stop'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function pause() {
  return new Promise(resolve => {
    send_input_action("pause", function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Pause/resume'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function home() {
  return new Promise(resolve => {
    send_input(remote_inputs["Home"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Home'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function info() {
  return new Promise(resolve => {
    send_input(remote_inputs["Info"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['Info'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

function contextmenu() {
  return new Promise(resolve => {
    send_input(remote_inputs["ContextMenu"], function(err, resp) {
      if (err) {
        response.conlog('xbmcremote plugin', 'Error: '+err.message, 'error');
      }
      response.conlog('xbmcremote plugin', 'Response: '+resp, 'data');
      if (resp.result == 'OK') {
        result = ['ContextMenu'];
      } else {
        result = ['error: '+resp.result];
      }
      result[1] = result[0];
      resolve(result);
    });
  })
};

// ----------------------------------------
// perform a request over HTTP. Basic common functionality that all other commands
// use to communicate with Kodi.
function do_request(reqpayload, fn) {
  xbmc_options.body = reqpayload;
  response.conlog('xbmcremote plugin', 'Performing request: '+JSON.stringify(xbmc_options.body), 'data');
    if (typeof fn === 'function') {
    return request(xbmc_options, function (error, resp, body) {
      fn(error, body);
    });

  } else {
    return request(xbmc_options, function (error, resp, body) {
    });
  }
};

// ----------------------------------------
// Send remote control input to Kodi as defined in the 'remote_inputs' above, eg
//    send_input(remote_inputs["Back"]);
function send_input(input, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": input,
                 "id": 1};
  do_request(payload, function(error, resp) {
    if (!error) {
      response.conlog('xbmcremote plugin', 'Send input callback got ok, response: '+JSON.stringify(resp), 'data');
    }
    fn(error, resp);
  });
};

// ----------------------------------------
// like send_input, but the full set, see Input.Action list above
// very useful are eg 'close'.
function send_input_action(inputaction, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "Input.ExecuteAction",
                 "params": { "action": inputaction},
                 "id": 1};
  do_request(payload, function(error, resp) {
      if (!error) {
        response.conlog('xbmcremote plugin', 'Send input action callback got ok, response: '+JSON.stringify(resp), 'data');
      }
      fn(error, resp);
    });
};

// ----------------------------------------
// Get a Kodi player instance, needed for querying for playing movies, stop/pause
// etc, but not for eg set/clear playlist or start movie
function get_player(fn) {
  var payload = {"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1};
  do_request(payload, function(error, resp) {
    if (error) {
        response.conlog('xbmcremote plugin', 'error getting player: '+JSON.stringify(resp), 'error');
    } else {
        response.conlog('xbmcremote plugin', 'got player: '+JSON.stringify(resp), 'data');
    }
    fn(error, resp);
  });
};