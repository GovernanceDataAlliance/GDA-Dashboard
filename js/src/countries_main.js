var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var Router = require('./routers/countries.js'),
    router = new Router({
      $el: $('.js--country-container')
    });

Handlebars.registerHelper('round', function(number) {
  console.log(number);
  return parseFloat(number).toFixed(2);
});

Backbone.history.start();
