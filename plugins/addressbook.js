// include dav module
var dav = require('dav');

// include vcf module
var vcardparser = require('vcard-parser');



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
  listaddressbooks: listaddrbooks,
  searchcontact: searchcontact
}

async function searchcontact(searchstring) {
  return new Promise(async (resolve) => {
    await dav.createAccount({ server: server, xhr: xhr, accountType: 'carddav', loadObjects: true })
    .then(function(account) {
      var result = [];
      var abcount = 0;
      var addressbookname;
      var regex = new RegExp(searchstring[1], "i");
      
      while (abcount < account.addressBooks.length) {
        addressbookname = account.addressBooks[abcount].displayName;

        var vcrdcount = 0;
        while (vcrdcount < account.addressBooks[abcount].objects.length) {
          var accountmatch = false;
          var vcardraw = account.addressBooks[abcount].objects[vcrdcount].addressData;
          var vcardobj = vcardparser.parse(vcardraw);
          var cardarray = [];
          var titles = [];
          var fullnames = [];
          var names = [];
          var nicknames = [];
          var orgs = [];
          var tels = [];
          var emails = [];
          var urls = [];
          var socials = [];
          var addresses = [];
          var genders = [];
          var dob = [];
          var dod = [];
          var cats = [];
          var notes = [];

          cardarray.push('\tAddressbook:\t'+addressbookname);

          if (vcardobj.categories && vcardobj.categories.length > 0) {
            var categoriescount = 0;
            while (categoriescount < vcardobj.categories.length) {
              var carddata = vcardobj.categories[categoriescount];
              cats[categoriescount] = carddata.value;
              categoriescount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Categories:\t'+cats.join(' & '));
          }

          if (vcardobj.gender && vcardobj.gender.length > 0) {
            var gendercount = 0;
            while (gendercount < vcardobj.gender.length) {
              var carddata = vcardobj.gender[gendercount];
              genders[gendercount] = carddata.value;
              gendercount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Gender:\t\t'+genders.join(', '));
          }

          if (vcardobj.bday && vcardobj.bday.length > 0) {
            var dobcount = 0;
            while (dobcount < vcardobj.bday.length) {
              var carddata = vcardobj.bday[dobcount];
              dob[dobcount] = carddata.value;
              dobcount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Date of birth:\t'+dob.join(', '));
          }

          if (vcardobj.deathdate && vcardobj.deathdate.length > 0) {
            var dodcount = 0;
            while (dodcount < vcardobj.deathdate.length) {
              var carddata = vcardobj.deathdate[dodcount];
              dod[dodcount] = carddata.value;
              dodcount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Date of death:\t'+dod.join(', '));
          }

          if (vcardobj.note && vcardobj.note.length > 0) {
            var notescount = 0;
            while (notescount < vcardobj.note.length) {
              var carddata = vcardobj.note[notescount];
              notes[notescount] = carddata.value;
              notescount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Notes:\t\t'+notes.join('\n\n'));
          }

          if (vcardobj.title && vcardobj.title.length > 0) {
            var titlecount = 0;
            while (titlecount < vcardobj.title.length) {
              var carddata = vcardobj.title[titlecount];
              titles[titlecount] = carddata.value;
              titlecount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Title:\t\t'+titles.join(' & '));
          }

          if (vcardobj.fn && vcardobj.fn.length > 0) {
            var fncount = 0;
            while (fncount < vcardobj.fn.length) {
              var carddata = vcardobj.fn[fncount];
              fullnames[fncount] = carddata.value;
              fncount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Full name:\t'+fullnames.join(' & '));
          }

          if (vcardobj.n && vcardobj.n.length > 0) {
            var ncount = 0;
            while (ncount < vcardobj.n.length) {
              var carddata = vcardobj.n[ncount];
              names[ncount] = carddata.value;
              ncount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Names:\t\t'+names.join(' & '));
          }

          if (vcardobj.nickname && vcardobj.nickname.length > 0) {
            var nncount = 0;
            while (nncount < vcardobj.nickname.length) {
              var carddata = vcardobj.nickname[nncount];
              nicknames[nncount] = carddata.value;
              nncount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Nickname:\t'+nicknames.join(' & '));
          }

          if (vcardobj.org && vcardobj.org.length > 0) {
            var orgcount = 0;
            while (orgcount < vcardobj.org.length) {
              var carddata = vcardobj.org[orgcount];
              orgs[orgcount] = carddata.value;
              orgcount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Organisation:\t'+orgs.join(' & '));
          }

          if (vcardobj.tel && vcardobj.tel.length > 0) {
            var telcount = 0;
            while (telcount < vcardobj.tel.length) {
              var carddata = vcardobj.tel[telcount];
              var teltype = carddata.meta.type[0].replace(/\"/g, '').toLowerCase();
              if (teltype.length < 8) {
                var tabs = '\t\t';
              } else {
                var tabs = '\t';
              }
              tels[telcount] = '('+teltype+')'+tabs+carddata.value;
              telcount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Phone nr:\n\t\t'+tels.join('\n\t\t'));
          }

          if (vcardobj.email && vcardobj.email.length > 0) {
            var emailcount = 0;
            while (emailcount < vcardobj.email.length) {
              var carddata = vcardobj.email[emailcount];
              var emailtype = carddata.meta.type[0].replace(/\"/g, '').toLowerCase();
              if (emailtype.length < 8) {
                var tabs = '\t\t';
              } else {
                var tabs = '\t';
              }
              emails[emailcount] = '('+emailtype+')'+tabs+carddata.value;
              emailcount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Email:\n\t\t'+emails.join('\n\t\t'));
          }

          if (vcardobj.url && vcardobj.url.length > 0) {
            var urlcount = 0;
            while (urlcount < vcardobj.url.length) {
              var carddata = vcardobj.url[urlcount];
              urls[urlcount] = carddata.value;
              urlcount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('URLs:\n\t\t\t'+urls.join('\n\t\t\t'));
          }

          if (vcardobj['X-SOCIALPROFILE'] && vcardobj['X-SOCIALPROFILE'].length > 0) {
            var socialcount = 0;
            while (socialcount < vcardobj['X-SOCIALPROFILE'].length) {
              var carddata = vcardobj['X-SOCIALPROFILE'][socialcount];
              var socialtype = carddata.meta.type[0].replace(/\"/g, '').toLowerCase();
              if (socialtype.length < 6) {
                var tabs = '\t\t';
              } else {
                var tabs = '\t';
              }
              socials[socialcount] = '('+socialtype+')'+tabs+carddata.value;
              socialcount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Social media:\n\t\t'+socials.join('\n\t\t'));
          }

          if (vcardobj.adr && vcardobj.adr.length > 0) {
            var addresscount = 0;
            while (addresscount < vcardobj.adr.length) {
              var carddata = vcardobj.adr[addresscount];
              var addresstype = carddata.meta.type[0].replace(/\"/g, '').toLowerCase();
              if (addresstype.length < 8) {
                var tabs = '\t\t';
              } else {
                var tabs = '\t';
              }
              addresses[addresscount] = '('+addresstype+')'+tabs+String(carddata.value).replace(/\,/g, '\n\t\t\t\t');
              addresscount++;
              if (regex.test(carddata.value)) {
                accountmatch = true;
              }
            };
            cardarray.push('Address:\n\t\t'+addresses.join('\n\t\t'));
          }

          if (accountmatch) {
            result.push(cardarray.join('\n\t'))
          }
//          console.log(cardarray);


          vcrdcount++;
        };

        abcount++;
      };


      if (result.length > 0) {
        if (result.length < 2) {
          result = 'I found '+result.length+' contact using the term \''+searchstring[1]+'\': \n'+result.join('');
        } else {
          result = 'I found '+result.length+' contacts using the term \''+searchstring[1]+'\': \n'+result.join('\n\n');
        }
      } else {
        result = 'I found no addressbooks in the supplied CardDAV server';
      }
      
      resolve(result);

    });

  })
}

async function listaddrbooks() {
  return new Promise(async (resolve) => {
    await dav.createAccount({ server: server, xhr: xhr, accountType: 'carddav' })
    .then(function(account) {
      var result = [];
      var i = 0;
      account.addressBooks.forEach(function(addressbook) {
        result[i] = addressbook.displayName;
        i++;
      });
      if (result.length > 0) {
        if (result.length < 2) {
          result = 'I found '+result.length+' addressbook: \n\t'+result.join('');
        } else {
          result = 'I found '+result.length+' addressbooks: \n\t'+result.join('\n\t');
        }
      } else {
        result = 'I found no addressbooks in the supplied CardDAV server';
      }
      resolve(result);
    });
  })
}