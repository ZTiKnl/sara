// include dav module
var dav = require('dav');

// starting vars
var caldav_config = require('./calendar/connection.json');

var server = caldav_config.host;;
var xhr = new dav.transport.Basic(
  new dav.Credentials({
    username: caldav_config.username,
    password: caldav_config.password
  })
);

module.exports = {
  listcalendars: listcals
}




async function listcals() {
  return new Promise(async (resolve) => {
    await dav.createAccount({ server: server, xhr: xhr, accountType: 'caldav' })
    .then(function(account) {
      var result = [];
      var i = 0;
      account.calendars.forEach(function(calendar) {
        result[i] = calendar.displayName;
        i++;
      });
      if (result.length > 0) {
        if (result.length < 2) {
          result = 'I found '+result.length+' calendar: \n\t'+result.join('');
        } else {
          result = 'I found '+result.length+' calendars: \n\t'+result.join('\n\t');
        }
      } else {
        result = 'I found no calendars in the supplied CalDAV server';
      }
      resolve(result);
    });
  })
}