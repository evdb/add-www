
/**
 * Module dependencies.
 */

var express    = require('express'),
    http       = require('http'),
    path       = require('path'),
    config     = require('config');

var app
  = module.exports
  = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('*', function (req, res) {

  var host = req.get('Host');

  // Set up some values that all pages need
  res.locals({
    to_domain:         'www.' + host,
    from_domain:       req.host, // strip port number
    redirect_delay:    config.general.redirect_delay,
    sales_site_name:   config.sales_app.name,
    sales_site_domain: config.sales_app.baseUrl,
  });

  // Check that we are not in what appears to be a redirection loop
  if ( /^www\./.test( req.host) ) {
    return res.render('loop_error');
  }

  res.render('free');

});
