
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

app.get('*', function (req, res) {

  var host = req.get('Host');

  res.locals({
    to_domain:         'www.' + host,
    from_domain:       req.host, // strip port number
    redirect_delay:    config.general.redirect_delay,
    sales_site_name:   config.sales_app.name,
    sales_site_domain: config.sales_app.host,
  });
  res.render('free.ejs');
});

