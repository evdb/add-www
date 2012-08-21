
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
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals({
  redirectDelay:     config.general.redirectDelay,
  sales_site_name:   config.general.name,
  sales_site_domain: config.general.salesBaseUrl,
});

app.all('*', function (req, res) {

  var host = req.get('Host');

  // Set up some values that all pages need
  res.locals({
    to_domain:         'www.' + host,
    from_domain:       req.host, // strip port number
  });

  // Check that we are not in what appears to be a redirection loop
  if ( /^www\./.test( req.host) ) {
    res
      .status(404)
      .render('loop_error');
    return;
  }

  res.render('free');

});
