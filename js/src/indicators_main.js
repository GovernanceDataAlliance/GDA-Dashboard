var $ = require('jquery'),
    Backbone = require('backbone');

var helpers = require('./helpers.js');

var Router = require('./routers/indicators.js'),
    router = new Router({
      $el: $('.js--indicators-container')
    });

Backbone.history.start();
