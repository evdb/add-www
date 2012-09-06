var url = require('url');


module.exports.cleanup = function (input) {  

  input = input.toLowerCase();

  // parse things that look like urls
  if ( /^http/.test(input) ) {
    input = url.parse(input).hostname;
  }

  // parse things that look like emails
  input = input.replace(/^.*@/, ''); 

  // Strip off leading 'www' if any
  input = input.replace(/^www\./, '');
  
  return input;

};

