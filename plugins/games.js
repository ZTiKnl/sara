// include prompt module
const prompt = require('../prompt.js');

// include colors module
const chalk = require('chalk');

module.exports = {
  rockpaperscissors: rps,
  tictactoe: ttt
}

function ttt() {
  return new Promise(resolve => {
    var board = {'1': '   ', '2': '   ', '3': '   ', '4': '   ', '5': '   ', '6': '   ', '7': '   ', '8': '   ', '9': '   '};
    var gameopen = true;
    var draw = false;
    var winner;
    var winrow;
    var activeplayer;
    Math.random() < 0.5 ? activeplayer = 'player' : activeplayer = 'ai';

    game(board);

    async function game() {
      if (activeplayer == 'player') {
        printboard();
        board = await usermove();
        activeplayer = 'ai';
      } else {
        board = aimove();
        activeplayer = 'player';
      }
      checkboardstatus(board);
    }

    function printboard() {
      var place1 = chalk.white.bold(board['1']);
      var place2 = chalk.white.bold(board['2']);
      var place3 = chalk.white.bold(board['3']);
      var place4 = chalk.white.bold(board['4']);
      var place5 = chalk.white.bold(board['5']);
      var place6 = chalk.white.bold(board['6']);
      var place7 = chalk.white.bold(board['7']);
      var place8 = chalk.white.bold(board['8']);
      var place9 = chalk.white.bold(board['9']);
      if (winrow == '123') {
        if (winner == 'player') {
          var place1 = chalk.green.bold(board['1']);
          var place2 = chalk.green.bold(board['2']);
          var place3 = chalk.green.bold(board['3']);
        } else {
          var place1 = chalk.red.bold(board['1']);
          var place2 = chalk.red.bold(board['2']);
          var place3 = chalk.red.bold(board['3']);
        }
      }
      if (winrow == '456') {
        if (winner == 'player') {
          var place4 = chalk.green.bold(board['4']);
          var place5 = chalk.green.bold(board['5']);
          var place6 = chalk.green.bold(board['6']);
        } else {
          var place4 = chalk.red.bold(board['4']);
          var place5 = chalk.red.bold(board['5']);
          var place6 = chalk.red.bold(board['6']);
        }
      }
      if (winrow == '789') {
        if (winner == 'player') {
          var place7 = chalk.green.bold(board['7']);
          var place8 = chalk.green.bold(board['8']);
          var place9 = chalk.green.bold(board['9']);
        } else {
          var place7 = chalk.red.bold(board['7']);
          var place8 = chalk.red.bold(board['8']);
          var place9 = chalk.red.bold(board['9']);
        }
      }
      if (winrow == '147') {
        if (winner == 'player') {
          var place1 = chalk.green.bold(board['1']);
          var place4 = chalk.green.bold(board['4']);
          var place7 = chalk.green.bold(board['7']);
        } else {
          var place1 = chalk.red.bold(board['1']);
          var place4 = chalk.red.bold(board['4']);
          var place7 = chalk.red.bold(board['7']);
        }
      }
      if (winrow == '258') {
        if (winner == 'player') {
          var place2 = chalk.green.bold(board['2']);
          var place5 = chalk.green.bold(board['5']);
          var place8 = chalk.green.bold(board['8']);
        } else {
          var place2 = chalk.red.bold(board['2']);
          var place5 = chalk.red.bold(board['5']);
          var place8 = chalk.red.bold(board['8']);
        }
      }
      if (winrow == '369') {
        if (winner == 'player') {
          var place3 = chalk.green.bold(board['3']);
          var place6 = chalk.green.bold(board['6']);
          var place9 = chalk.green.bold(board['9']);
        } else {
          var place3 = chalk.red.bold(board['3']);
          var place6 = chalk.red.bold(board['6']);
          var place9 = chalk.red.bold(board['9']);
        }
      }
      if (winrow == '159') {
        if (winner == 'player') {
          var place1 = chalk.green.bold(board['1']);
          var place5 = chalk.green.bold(board['5']);
          var place9 = chalk.green.bold(board['9']);
        } else {
          var place1 = chalk.red.bold(board['1']);
          var place5 = chalk.red.bold(board['5']);
          var place9 = chalk.red.bold(board['9']);
        }
      }
      if (winrow == '357') {
        if (winner == 'player') {
          var place3 = chalk.green.bold(board['3']);
          var place5 = chalk.green.bold(board['5']);
          var place7 = chalk.green.bold(board['7']);
        } else {
          var place3 = chalk.red.bold(board['3']);
          var place5 = chalk.red.bold(board['5']);
          var place7 = chalk.red.bold(board['7']);
        }
      }
      console.log(chalk.yellow.bold(place1+'|'+place2+'|'+place3));
      console.log(chalk.yellow.bold('-----------'));
      console.log(chalk.yellow.bold(place4+'|'+place5+'|'+place6));
      console.log(chalk.yellow.bold('-----------'));
      console.log(chalk.yellow.bold(place7+'|'+place8+'|'+place9));
      console.log('');
    }
    async function usermove() {
      var options = getoptions();
      let userchoice = await ask('Select a move ('+options.join(',')+') or (a)bort')
      if (userchoice == 'a' || userchoice == 'abort') {
        gameopen = false;
      } else {
        if (options.includes(Number(userchoice))) {
          board[userchoice] = ' X ';
        } else {
          console.log('invalid choice, try again')
          await usermove();
        }
      }
      return board;
    }
    function aimove() {
      var options = getoptions();
      var randomAnswer = options[Math.floor(Math.random() * options.length)];
      board[randomAnswer] = ' O ';
      return board;
    }

    function getoptions() {
      var options = [];
      var i = 1;
      while (i < 10) {
        if (board[i] == '   ') {
          options.push(i);
        }
        i++;
      }
      return options;
    }

    function checkboardstatus(obj) {
      if ((board['1'] == ' X ' && board['2'] == ' X ' && board['3'] == ' X ') || (board['1'] == ' O ' && board['2'] == ' O ' && board['3'] == ' O ')) {
        gameopen = false;
        if (board['1'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '123';
      }
      if ((board['4'] == ' X ' && board['5'] == ' X ' && board['6'] == ' X ') || (board['4'] == ' O ' && board['5'] == ' O ' && board['6'] == ' O ')) {
        gameopen = false;
        if (board['4'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '456';
      }
      if ((board['7'] == ' X ' && board['8'] == ' X ' && board['9'] == ' X ') || (board['7'] == ' O ' && board['8'] == ' O ' && board['9'] == ' O ')) {
        gameopen = false;
        if (board['7'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '789';
      }
      if ((board['1'] == ' X ' && board['4'] == ' X ' && board['7'] == ' X ') || (board['1'] == ' O ' && board['4'] == ' O ' && board['7'] == ' O ')) {
        gameopen = false;
        if (board['1'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '147';
      }
      if ((board['2'] == ' X ' && board['5'] == ' X ' && board['8'] == ' X ') || (board['2'] == ' O ' && board['5'] == ' O ' && board['8'] == ' O ')) {
        gameopen = false;
        if (board['2'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '258';
      }
      if ((board['3'] == ' X ' && board['6'] == ' X ' && board['9'] == ' X ') || (board['3'] == ' O ' && board['6'] == ' O ' && board['9'] == ' O ')) {
        gameopen = false;
        if (board['3'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '369';
      }
      if ((board['1'] == ' X ' && board['5'] == ' X ' && board['9'] == ' X ') || (board['1'] == ' O ' && board['5'] == ' O ' && board['9'] == ' O ')) {
        gameopen = false;
        if (board['1'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '159';
      }
      if ((board['3'] == ' X ' && board['5'] == ' X ' && board['7'] == ' X ') || (board['3'] == ' O ' && board['5'] == ' O ' && board['7'] == ' O ')) {
        gameopen = false;
        if (board['3'] == ' X ') {
          gameopen = false;
          winner = 'player';
        } else {
          gameopen = false;
          winner = 'ai';
        }
        winrow = '357';
      }

      if (board['1'] != '   ' && board['2'] != '   ' && board['3'] != '   ' && board['4'] != '   ' && board['5'] != '   ' && board['6'] != '   ' && board['7'] != '   ' && board['8'] != '   ' && board['9'] != '   ') {
        gameopen = false;
        if (!winner) {
          draw = true;
        }
      }
      if (!gameopen) {
        if (!draw) {
          if (winner == 'player') {
            printboard();
            resolve('You won!');
          } else if (winner == 'ai') {
            printboard();
            resolve('I won!');
          } else {
            resolve('Stopped playing game');
          }
        } else {
          printboard();
          resolve('Draw, nobody wins');
        }
      } else {
        game();
      }
    }
  })
}

function rps(input) {
  var userselection = input[1].toLowerCase();
  var options = [
    "rock",
    "paper",
    "scissors"
  ]
  var aiselection = options[Math.floor(Math.random() * options.length)];

  var game_result;
  var win;
  var draw;
  if (userselection == 'rock' && aiselection == 'rock') {
    game_result = 'Rock vs rock, draw';
    win = false;
    draw = true;
  }
  if (userselection == 'rock' && aiselection == 'paper') {
    game_result = 'Paper covers rock, you lose';
    win = false;
    draw = false;
  }
  if (userselection == 'rock' && aiselection == 'scissors') {
    game_result = 'Rock crushes scissors, you win';
    win = true;
    draw = false;
  }

  if (userselection == 'paper' && aiselection == 'paper') {
    game_result = 'Paper vs paper, draw';
    win = false;
    draw = true;
  }
  if (userselection == 'paper' && aiselection == 'scissors') {
    game_result = 'Scissors cuts paper, you lose';
    win = false;
    draw = false;
  }
  if (userselection == 'paper' && aiselection == 'rock') {
    game_result = 'Paper covers rock, you win';
    win = true;
    draw = false;
  }
  
  if (userselection == 'scissors' && aiselection == 'scissors') {
    game_result = 'Scissors vs scissors, draw';
    win = false;
    draw = true;
  }
  if (userselection == 'scissors' && aiselection == 'rock') {
    game_result = 'Rock crushes scissors, you lose';
    win = false;
    draw = false;
  }
  if (userselection == 'scissors' && aiselection == 'paper') {
    game_result = 'Scissors cuts paper, you win';
    win = true;
    draw = false;
  }
  result = [game_result];
  result[1] = result[0];
  return result;
}

async function ask(string) {
  let answer = await prompt.question(string)
  return answer;
}