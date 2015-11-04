var Backbone = require('backbone');

var Router = require('./routers/countries.js'),
    router = new Router();
Backbone.history.start();
