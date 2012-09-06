
/**
 * Module dependencies.
 */

var express    = require('express'),
    path       = require('path'),
    config     = require('config'),
    async      = require('async'),
    dns        = require('dns'),
    domains    = require('./src/domains');
  

var app = module.exports = express();

app.configure(function () {  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals({
  configGeneral: config.general,
});

app.get('/', function (req, res) {
  res.render('index');
});

// Various static pages
app.get('/faq',     function (req, res) { res.render('faq');     });
app.get('/pricing', function (req, res) { res.render('pricing'); });

app.get('/domain/:domain', function(req,res,next) {
  var domain = req.param('domain');

  var clean_domain = domains.cleanup(domain);

  // clean up the domain
  if ( domain != clean_domain ) {
    return res.redirect( '/domain/' + clean_domain );
  }

  var error_trap = function (cb) {
    return function (err, result) {
      if (err) console.log( err );
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
      if (err) return next(err);

      res.locals(results);
      res.locals({ domain: domain });

      console.log( res.locals );

      res.render( 'domain' );
    }
  );

});

app.get('/domain', function ( req, res ) {
  var q = domains.cleanup(req.param('q'));
  if (!q) return res.redirect('/');
  return res.redirect('/domain/' + q );
});

app.get('*', function (req, res) {
  res
    .status(404)
    .render('error_404');
});