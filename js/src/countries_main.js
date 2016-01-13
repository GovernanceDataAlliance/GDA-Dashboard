var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var Router = require('./routers/countries.js'),
    router = new Router({
      $el: $('.js--country-container')
    });

Handlebars.registerHelper('round', function(options) {
  if (this.score % 1 != 0) {
    return parseFloat(this.score).toFixed(2);
  } else {
    return this.score;
  }
});

Backbone.history.start();
