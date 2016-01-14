var Backbone = require('backbone'),
    $ = require('jquery');

var helpers = require('./helpers/handlebars.js');

var Router = require('./routers/indicators.js'),
    router = new Router({
      $el: $('.js--indicators-container')
    });

Backbone.history.start();
