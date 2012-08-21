
/**
 * Module dependencies.
 */

var express    = require('express'),
    path       = require('path'),
    config     = require('config');
  

var app = module.exports = express();

app.configure(function () {  
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
  configGeneral: config.general,
});

app.get('/', function (req, res) {
  res.render('index');
});