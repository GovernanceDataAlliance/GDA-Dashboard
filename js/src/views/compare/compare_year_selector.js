var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/compare/compare_year_selector.hbs'));

var CompareYearSelectors = Backbone.View.extend({

  events: {
    'change .js--year-selector': 'getYear'
  },

  initialize: function(options) {
    options = options || {};
    this.years = options.years;
    this.actualYear = options.actualYear;
    this.render();
  },

  render: function() {
    this.$el.html(template({ 'years': this.years }));
    this.setCurrentYear();
    this.$('select').chosen();
  },

  setCurrentYear: function() {
    this.actualYear ? $('#year-'+ this.actualYear ).attr('selected', true) : $(this.$('option')[0]).attr('selected', true);
  },

  getYear: function(e) {
    var year = $(e.currentTarget).val();
    Backbone.Events.trigger('year:selected', year);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareYearSelectors;
