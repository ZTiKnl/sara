// include prompt module
const prompt = require('../prompt.js');

// include colors module
const chalk = require('chalk');

// include colored responses module
const response = require('../response.js');

// include request module
var request = require('request');

// starting vars
var xbmc_host = '192.168.0.201';
var xbmc_port = '54323';
var xbmc_username = 'osmc';
var xbmc_password = 'Qzmp01!)';
if (xbmc_username != '' && xbmc_password != '') {
  var xbmc_json_rpc_url = "http://" + xbmc_username + ":" + xbmc_password + "@" + xbmc_host + ":" + xbmc_port + "/jsonrpc";
} else {
  var xbmc_json_rpc_url = "http://" + xbmc_host + ":" + xbmc_port + "/jsonrpc";
}
var headers = {
    'User-Agent': 'kodi-controller.js'
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
    remote_inputs["SendText"] = "Input.SendText";
    remote_inputs["ExecuteAction"] = "Input.ExecuteAction";
    remote_inputs["PlayPause"] = "Player.PlayPause";


// -----------------------------------------------------------------------------
// export functions for module use
module.exports = {
  menumove: menumove,
  up: up,
  down: down,
  left: left,
  right: right,
  back: back,
  select: select,
  stop: stop,
  pause: pause,
  send_input: send_input,
  send_input_action: send_input_action,
  get_player: get_player,
  remote_inputs: remote_inputs
}
// -----------------------------------------------------------------------------

function menumove(x) {
  if (x[2] == undefined || x[2] === 1) {
    if (x[1] == 'up') { up(); }
    if (x[1] == 'down') { down(); }
    if (x[1] == 'left') { left(); }
    if (x[1] == 'right') { right(); }
  } else {
      let i = 0;
      while (i < x[2]) {
        if (x[1] == 'up') { up(); }
        if (x[1] == 'down') { down(); }
        if (x[1] == 'left') { left(); }
        if (x[1] == 'right') { right(); }
        i++;
      }
  }
return;
}

// ----------------
function up(fn) {
  send_input(remote_inputs["Up"], function(err, resp) {
    if (!err) {
      console.log("up was ok");
    } else {
      console.log("up was NOT ok");
    }
    console.log(resp);

    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------
function down(fn) {
  send_input(remote_inputs["Down"], function(err, resp) {
    if (!err) {
      console.log("down was ok");
    } else {
      console.log("down was NOT ok");
    }
    console.log(resp);

    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------
function left(fn) {
  send_input(remote_inputs["Left"], function(err, resp) {
    if (!err) {
      console.log("left was ok");
    } else {
      console.log("left was NOT ok");
    }
    console.log(resp);

    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------
function right(fn) {
  send_input(remote_inputs["Right"], function(err, resp) {
    if (!err) {
      console.log("right was ok");
    } else {
      console.log("right was NOT ok");
    }
    console.log(resp);

    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------
function back(fn) {
  send_input(remote_inputs["Back"], function(err, resp) {
    if (!err) {
      console.log("back was ok");
    } else {
      console.log("back was NOT ok");
    }
    console.log(resp);

    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------
function select(fn) {
  send_input(remote_inputs["Select"], function(err, resp) {
    if (!err) {
      console.log("select was ok");
    } else {
      console.log("select NOT ok");
    }
    console.log(resp);

    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------
function stop(fn) {
  send_input_action("stop", function(err, resp) {
    if (!err) {
      console.log("stop was ok");
    } else {
      console.log("stop was NOT ok");
    }
    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------
function pause(fn) {
  send_input_action("pause", function(err, resp) {
    if (!err) {
      console.log("pause was ok");
    } else {
      console.log("pause NOT ok");
    }
    console.log(resp);

    if (typeof fn === 'function') {
      fn(err, resp);
    }
  });
};

// ----------------------------------------
// perform a request over HTTP. Basic common functionality that all other commands
// use to communicate with Kodi.
function do_request(reqpayload, fn) {
  xbmc_options.body = reqpayload;
  console.log("Performing request:" + JSON.stringify(xbmc_options.body));
  if (typeof fn === 'function') {
    return request(xbmc_options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  // console.log("got ok+callback:" + JSON.stringify(body));
              } else {
                  // console.log("got error+callback:" + JSON.stringify(body));
              }
              fn(error, body);
            });

  } else {
    return request(xbmc_options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log("got ok, no callback:" + JSON.stringify(body));
            }
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
  // console.log("Sending input");
  do_request(payload, function(error, response) {
    if (!error) {
      console.log("Send input callback got ok, response:" + JSON.stringify(response));
    }
    fn(error, response);
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
  do_request(payload, function(error, response) {
      if (!error) {
        console.log("Send input action callback got ok, response:" + JSON.stringify(response));
      }
      fn(error, response);
    });
};

// ----------------------------------------
// Get a Kodi player instance, needed for querying for playing movies, stop/pause
// etc, but not for eg set/clear playlist or start movie
function get_player(fn) {
  var payload = {"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1};
  do_request(payload, function(error, response) {
    if (error) {
        console.log("error getting player:" + JSON.stringify(response));
    } else {
        console.log("got player:" + JSON.stringify(response));
    }
    fn(error, response);
  });
};