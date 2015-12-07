var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/countries/country_toolbar.hbs'));

var CountryToolbarView = Backbone.View.extend({
  
  className: 'wrap',

  initialize: function() {
    console.log('hola')
  },

  render: function() {
    this.$el.html(template({}));

    return this;
  }
});

module.exports = CountryToolbarView;
