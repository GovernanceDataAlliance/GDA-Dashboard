var Backbone = require('backbone'),
    $ = require('jquery');

var Router = require('./routers/welcome.js'),
    router = new Router({
      $el: $('js-welcome')
    });

Backbone.history.start();
