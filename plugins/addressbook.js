// include dav module
var dav = require('dav');

// starting vars
var carddav_config = require('./addressbook/connection.json');

var server = carddav_config.host;;
var xhr = new dav.transport.Basic(
  new dav.Credentials({
    username: carddav_config.username,
    password: carddav_config.password
  })
);

module.exports = {
  listaddressbooks: listaddrbooks
}

async function listaddrbooks() {
  return new Promise(async (resolve) => {
    await dav.createAccount({ server: server, xhr: xhr, accountType: 'carddav' })
    .then(function(account) {
      // account instanceof dav.Account
      account.addressBooks.forEach(function(addressbooks) {
        console.log('Found addressbooks named ' + addressbooks.displayName);
        // etc.
      });
      resolve(account.addressBooks.length);
    });
  })
}