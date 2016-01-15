var Backbone = require('backbone'),
    $ = require('jquery');

var helpers = require('./helpers/handlebars.js');

var Router = require('./routers/welcome.js'),
    router = new Router({
      $el: $('js-welcome')
    });

Backbone.history.start();
