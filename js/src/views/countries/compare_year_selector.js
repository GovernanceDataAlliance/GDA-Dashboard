var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var template = Handlebars.compile(
  require('../../templates/countries/compare_year_selector.hbs'));

var CompareYearSelectors = Backbone.View.extend({

  events: {
    'change .js--year-selector': 'getYear'
  },

  initialize: function(options) {
    options = options || {};
    this.years = options.years;
    this.render();
  },

  render: function() {
    this.$el.html(template({ 'years': this.years }));

    this.$('#year-2015').attr('selected', true);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareYearSelectors;
