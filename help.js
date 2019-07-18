// include colored responses module
const response = require('./response.js');

// include colors module
const chalk = require('chalk');

// include fs module
const fs = require('fs');

module.exports = {
  questions: questions,
  add: add,
  help: help,
  get: function(line) {
    line = line.trim();
    if (line.length == 4 && line == 'help') {
      help('help');
    } else {
      var topicstart = 0;
      if (line.substr(0,6) == 'help: ') {
        topicstart = 6;
      } else if (line.substr(0,5) == 'help:') {
        topicstart = 5;
      } else if (line.substr(0,14) == 'help on topic:') {
        topicstart = 14;
      } else if (line.substr(0,13) == 'help on topic') {
        topicstart = 13;
      } else if (line.substr(0,10) == 'help topic') {
        topicstart = 10;
      } else if (line.substr(0,7) == 'help on') {
        topicstart = 7;
      } else if (line.substr(0,4) == 'help') {
        topicstart = 4;
      }
      var topic = line.substr(topicstart, line.length).trim()

      help(topic);
    }
  }
}

// include prompt module
const prompt = require('./prompt.js');


function add(varname, vardescription, varexplanation, helpupdated) {
  const data = {
    name: varname,
    description: vardescription,
    explanation: varexplanation
  }
  const jsonString = JSON.stringify(data, null, 2)
  response.conlog('help.add', jsonString, 'data');
  fs.writeFile('./documentation/'+varname+'.json', jsonString, err => {
    if (err) {
      response.conlog('help.add', 'Error writing to file: '+err.message, 'error');
    } else {
      if (helpupdated == 'update') {
        response.conlog('help.add', 'Help topic '+varname+' has been updated', 'info');
      } else {
        response.conlog('help.add', 'Help topic '+varname+' has been added', 'info');
      }
    }
  })
}

function help(topic, field) {
  fs.readFile('./documentation/'+topic+'.json', 'utf8', (err, jsonString) => {
    if (err) {
      if (err.code == 'ENOENT') {
        response.conlog('help', 'There is no documentation for topic: '+topic, 'response');
      } else {
        response.conlog('help', 'Failed to fetch help topic contents: '+err.message, 'error');
      }
      return;
    }
    response.conlog('help', 'Help on topic: '+ topic, 'response');
    try {
      const helptopic = JSON.parse(jsonString);
      if (field == 'description') {
        response.conlog('help', helptopic.description, 'help');
      } else if (field == 'explanation') {
        response.conlog('help', helptopic.explanation, 'help');
      } else {
        response.conlog('help', helptopic.description+'\n\n'+helptopic.explanation, 'help');
      }
      return;
    } catch(err) {
      response.conlog('help', 'Error parsing JSON string: '+err.message, 'error');
    }
  })
}


function questions(var_name, var_description, var_explanation, var_update) {
  var helpname;
  var helpdescription;
  var helpexplanation;

  var questionname = 'Enter a name>';
  if (response.getcolors()) {
    questionname = chalk.bold.magentaBright(questionname);
  }
  var questiondescription = 'Enter description>';
  if (response.getcolors()) {
    questiondescription = chalk.bold.magentaBright(questiondescription);
  }
  var questionexplanation = 'Enter explanation>';
  if (response.getcolors()) {
    questionexplanation = chalk.bold.magentaBright(questionexplanation);
  }
  var questionconfirmation = 'Is this information correct (y)es/(n)o/(a)bort>';
  if (response.getcolors()) {
    questionconfirmation = chalk.bold.magentaBright(questionconfirmation);
  }

  
  if (var_name !== null) {
    setTimeout(writevarname, 50, var_name);
    function writevarname(var_name) {
      prompt.write(var_name);
    }
  }
  prompt.question(questionname)
  .then((name) => {
    helpname = name;
    if (var_description !== null) {
      setTimeout(writevardescription, 50, var_description);
      function writevardescription(var_description) {
        prompt.write(var_description);
      }
    }
    return prompt.question(questiondescription);
  })
  .then((description) => {
    helpdescription = description;
    if (var_explanation !== null) {
      setTimeout(writevarexplanation, 50, var_explanation);
      function writevarexplanation(var_explanation) {
        prompt.write(var_explanation);
      }
    }
    return prompt.question(questionexplanation);
  })
  .then((explanation) => {
    helpexplanation = explanation;
    response.conlog('help', 'name: '+helpname+'\ndescription: '+helpdescription+'\nexplanation: '+helpexplanation, 'info');

    confirmation()
    function confirmation() {
      prompt.question(questionconfirmation)
      .then((confirmation) => {
        if (confirmation.toLowerCase() == 'y' || confirmation.toLowerCase() == 'yes') {
          add(helpname, helpdescription, helpexplanation, var_update)
          return;
        } else if (confirmation.toLowerCase() == 'n' || confirmation.toLowerCase() == 'no') {
          questions(helpname, helpdescription, helpexplanation, var_update)
          return;
        } else if (confirmation.toLowerCase() == 'a' || confirmation.toLowerCase() == 'abort') {
          response.conlog('help', 'aborted '+var_update+' help', 'info');
          //do nothing
          return;
        } else {
          return confirmation();
        }
      })
    }
  })
}