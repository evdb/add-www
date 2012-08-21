
/**
 * Module dependencies.
 */

var connect        = require('connect'),
    config         = require('config'),
    sales_app      = require('./apps/sales').app,
    redirector_app = require('./apps/redirector').app;

connect(
  connect.logger({
    format: ':status :method http://:req[Host]:url :res[content-length] (:response-time ms)'
  }),
  connect.vhost( config.general.salesHost, sales_app ),
  redirector_app
)
.listen(config.server.port);

console.log(
  "Running: http://%s:%s",
  config.general.salesHost,
  config.server.port
);
