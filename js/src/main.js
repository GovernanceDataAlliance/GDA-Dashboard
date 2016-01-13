var Backbone = require('backbone'),
    Handlebars = require('handlebars');

Handlebars.registerHelper('round', function(number) {
  console.log(number);
  return parseFloat(number).toFixed(2);
});