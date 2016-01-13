var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

    // chosen = require('chosen-jquery-browserify');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators_year_selector.hbs'));

var IndicatorYearSelector = Backbone.View.extend({

  events: {
    'change': 'getYear'
  },

  initialize: function(options) {
    options = options || {};
    this.years = options.years;
    this.actualYear = options.actualYear;
    this.render();
  },

  render: function() {
    this.$el.html(template({ 'years': this.years }));
    // this.$('select').chosen();
    this.setCurrentYear();
  },

  setCurrentYear: function() {
    this.actualYear ? $('#year-'+ this.actualYear ).attr('selected', true) : $(this.$('option')[0]).attr('selected', true);
  },

  getYear: function(e) {
    var year = $(e.currentTarget).val();
    Backbone.Events.trigger('yearForIndicator:selected', year);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorYearSelector;
