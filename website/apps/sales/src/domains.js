var url        = require('url'),
    async      = require('async'),
    dns        = require('dns');


module.exports.cleanup = function (input) {  

  // get rid of whitespace
  input = input.replace(/\s+/g, '');

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


module.exports.get_details = function (domain, done) {

  var error_trap = function (cb) {
    return function (err, result) {
      if (err) console.log( domain, err );
      cb( null, result || [] );
    };
  };

  async.parallel(
    {
      root_ip_address: function (cb) {
        dns.resolve4(domain, error_trap(cb) );
      },
      www_cname: function (cb) {
        dns.resolveCname('www.' + domain, error_trap(cb) );
      },
      www_ip_address: function (cb) {
        dns.resolve4('www.' + domain, error_trap(cb) );
      }
    },
    function (err, results) {

      results.domain = domain;

      console.log( results );

      done(err, results);
    }
  );
}
