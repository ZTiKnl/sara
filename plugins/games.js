module.exports = {
  rockpaperscissors: function (input) {
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
}