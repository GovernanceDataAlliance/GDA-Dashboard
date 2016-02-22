var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var helpers = require('./helpers/handlebars.js');

var Router = require('./routers/compare.js'),
    router = new Router({
      $el: $('.js--compare-container')
    });

Backbone.history.start();