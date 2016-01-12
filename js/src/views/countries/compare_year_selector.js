var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery'),
    async = require('async');

var CountriesCollection = require('../../collections/countries.js');

var template = Handlebars.compile(
  require('../../templates/countries/compare_year_selector.hbs'));

var CompareYearSelectors = Backbone.View.extend({

  events: {
    'change .js--year-selector': 'getYear'
  },

  initialize: function(options) {
    options = options || {};

    this.countriesCollection = new CountriesCollection();
    this.render();
  },

  render: function() {
    this.$el.html(template());
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareYearSelectors;
