var Backbone = require('backbone'),
    $ = require('jquery');

var Router = require('./routers/countries.js'),
    router = new Router({
      $el: $('.js--country-container')
    });

Backbone.history.start();
