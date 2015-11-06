var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Countries = require('../../collections/countries.js');
var CountryList = require('./country_list.js');

var template = Handlebars.compile(
  require('../../templates/countries/countries.hbs'));

var CountriesView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.countries = new Countries();
  },

  render: function() {
    this.$el.html(template());
    this.renderCountryList();

    return this;
  },

  renderCountryList: function() {
    var listView = new CountryList({countries: this.countries});
    this.$('.js--countries').html(listView.render().el);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CountriesView;
