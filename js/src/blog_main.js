var Backbone = require('backbone'),
    $ = require('jquery');

var helpers = require('./helpers/handlebars.js');

var Router = require('./routers/blog.js'),
    router = new Router({
      $el: $('js-blog')
    });

Backbone.history.start();
