var $ = require('jquery');
global.$ = $; // for chosen.js

var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    chosen = require('chosen-jquery-browserify');

var template = Handlebars.compile(
  require('../../templates/common/year_selector.hbs'));

var IndicatorYearSelector = Backbone.View.extend({

  events: {
    'change select': 'getYear'
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
    this.setChosen();
  },

  setCurrentYear: function() {
    this.actualYear ? $('#year-'+ this.actualYear ).attr('selected', true) : $(this.$('option')[0]).attr('selected', true);
  },

  setChosen: function() {
    debugger
    this.$el.find('select').chosen();
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
