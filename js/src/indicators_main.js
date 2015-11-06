var Backbone = require('backbone'),
    $ = require('jquery');

var Router = require('./routers/indicators.js'),
    router = new Router({
      $el: $('.js--indicators-container')
    });

Backbone.history.start();
