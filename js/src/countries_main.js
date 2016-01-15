var $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var helpers = require('./helpers/handlebars.js');

var Router = require('./routers/countries.js'),
    router = new Router({
      $el: $('.js--country-container')
    });

Backbone.history.start();
