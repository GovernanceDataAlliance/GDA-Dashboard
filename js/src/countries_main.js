var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var helpers = require('./helpers.js');

var Router = require('./routers/countries.js'),
    router = new Router({
      $el: $('.js--country-container')
    });

Backbone.history.start();
