var url        = require('url'),
    async      = require('async'),
    dns        = require('dns'),
    _          = require('underscore'),
    config     = require('config');


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
      root_ip_addresses: function (cb) {
        dns.resolve4(domain, error_trap(cb) );
      },
      // www_cname: function (cb) {
      //   dns.resolveCname('www.' + domain, error_trap(cb) );
      // },
      www_ip_addresses: function (cb) {
        dns.resolve4('www.' + domain, error_trap(cb) );
      },
      redirect_type: function (cb) {
        // free, instant, instant_expires_soon
        cb(null, 'free');
      },
      domain: function (cb) { cb(null, domain); }
    },
    done
  );
}

/*
  These are the errors:

  does_not_resolve

  not_our_ip
  is_our_ip

  not_paid
  paid_but_expires_soon
  paid

*/

module.exports.report = function ( details ) {

  var result = {};
  var our_ip = config.general.redirector_ip_address;
  
  function dont_match_our_ip (ip) {
    return ip != our_ip;
  }

  function test_ips(ips) {
    if (!ips.length) {
      return 'does_not_resolve';
    }
        
    return _.any(ips, dont_match_our_ip) ? 'not_our_ip' : 'is_our_ip';

  }

  result.root_ip_status = test_ips(details.root_ip_addresses);
  result.www_ip_status  = test_ips(details.www_ip_addresses);

  return result;
}
