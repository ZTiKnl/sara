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
      // account instanceof dav.Account
      account.calendars.forEach(function(calendar) {
        console.log('Found calendar named ' + calendar.displayName);
        // etc.
      });
      resolve(account.calendars.length);
    });
  })
}